import { expect, test } from "@playwright/test";

test("verified artefact journey and editorial discoveries work", async ({
  page,
}) => {
  test.skip(
    !process.env.E2E_LIVE_RECORDS,
    "requires the deployed authoritative registry",
  );
  await page.goto("/");
  const record = page.getByRole("button", {
    name: /Dancing Baby.*Finalised GenLayer record/i,
  });
  await expect(record).toBeVisible({ timeout: 30000 });
  const scene = page.locator(".atlas-scene");
  const before = await scene.getAttribute("style");
  await record.click();
  await expect(
    page.getByRole("heading", { name: "Dancing Baby" }),
  ).toBeVisible();
  expect(await scene.getAttribute("style")).toBe(before);
  await page.getByRole("link", { name: /Enter exhibit/i }).click();
  await expect(page).toHaveURL(/\/artefact\//);
  await expect(
    page.getByRole("heading", { name: "Dancing Baby" }),
  ).toBeVisible();
  await expect(page.getByText(/preservation assessment/i)).toBeVisible();
  await page.goto("/");
  await page
    .getByRole("button", { name: /Communities.*Interpretive scenery/i })
    .click();
  await expect(
    page.getByRole("heading", { name: "Communities" }),
  ).toBeVisible();
  await expect(
    page.getByText(/Forums, fan pages and chat rooms/i),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: "Communities" }),
  ).not.toBeVisible();
});
