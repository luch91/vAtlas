import json
import pytest


def payload(**changes):
    value = {
        "title": "The Dancing Baby",
        "source_url": "https://example.org/dancing-baby",
        "category": "creative-work",
        "historical_context": "An early widely circulated web animation documented by contemporary sources.",
        "evidence_urls": ["https://example.org/history"],
    }
    value.update(changes)
    return json.dumps(value)


def accepted_model():
    return json.dumps({
        "status": "ACCEPTED", "identifiable": True,
        "evidence_supports_context": True, "material_contradiction": False,
        "preservation_value": True, "reason": "The source identifies the work and supports its context.",
        "evidence_summary": "A contemporary history describes its circulation and cultural influence."
    })


def test_valid_submission_and_pagination(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py")
    direct_vm.sender = direct_alice
    direct_vm.mock_web(r".*example\.org/history.*", {"status": 200, "body": "History of the Dancing Baby and its early web circulation."})
    direct_vm.mock_llm(r".*cultural-history registry.*", accepted_model())
    entry_id = contract.submit_entry(payload())
    record = json.loads(contract.get_entry(entry_id))
    assert record["assessment_status"] == "ACCEPTED"
    assert record["assessment_version"] == "vatlas-rubric-v1"
    page = json.loads(contract.list_entries(0, 10, True))
    assert [item["id"] for item in page["entries"]] == [entry_id]
    assert page["has_more"] is False


def test_missing_and_oversized_fields_revert(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py")
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Invalid title"):
        contract.submit_entry(payload(title=""))
    with direct_vm.expect_revert("Invalid historical context"):
        contract.submit_entry(payload(historical_context="x" * 2001))


def test_invalid_private_url_reverts(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py")
    direct_vm.sender = direct_alice
    with direct_vm.expect_revert("Private URLs are not allowed"):
        contract.submit_entry(payload(evidence_urls=["http://localhost/evidence"]))


def test_duplicate_rejected(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py")
    direct_vm.sender = direct_alice
    direct_vm.mock_web(r".*example\.org/history.*", {"status": 200, "body": "Supported history."})
    direct_vm.mock_llm(r".*cultural-history registry.*", accepted_model())
    contract.submit_entry(payload())
    with direct_vm.expect_revert("already registered"):
        contract.submit_entry(payload())


def test_unavailable_evidence_is_inconclusive(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py")
    direct_vm.sender = direct_alice
    direct_vm.mock_web(r".*example\.org/history.*", {"status": 503, "body": "unavailable"})
    entry_id = contract.submit_entry(payload())
    record = json.loads(contract.get_entry(entry_id))
    assert record["assessment_status"] == "INCONCLUSIVE"
    assert json.loads(contract.list_entries(0, 10, True))["entries"] == []


def test_contradictory_evidence_is_rejected(direct_vm, direct_deploy, direct_alice):
    contract = direct_deploy("contracts/main.py")
    direct_vm.sender = direct_alice
    direct_vm.mock_web(r".*example\.org/history.*", {"status": 200, "body": "This source contradicts the nomination."})
    direct_vm.mock_llm(r".*cultural-history registry.*", json.dumps({
        "identifiable": True, "evidence_supports_context": False, "material_contradiction": True,
        "preservation_value": False, "reason": "The evidence contradicts the material claim.",
        "evidence_summary": "The cited account describes a different origin."
    }))
    entry_id = contract.submit_entry(payload())
    assert json.loads(contract.get_entry(entry_id))["assessment_status"] == "REJECTED"


def test_pagination_bounds(direct_vm, direct_deploy):
    contract = direct_deploy("contracts/main.py")
    with direct_vm.expect_revert("Page size must be 1 to 25"):
        contract.list_entries(0, 26, False)


def test_equivalence_validator_is_substantive():
    source = open("contracts/main.py", encoding="utf-8").read()
    validator = source.split("def validator(leader_result):", 1)[1].split("assessment =", 1)[0]
    assert "assess_entry(entry_memory)" in validator
    assert "assessment_signature" in validator
    assert "return True" not in validator
    assert all(field in source for field in ("material_contradiction", "evidence_supports_context", "preservation_value"))
