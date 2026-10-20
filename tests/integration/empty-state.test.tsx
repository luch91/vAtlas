// @vitest-environment jsdom
import '../setup';import {render,screen} from '@testing-library/react';import {describe,expect,it,vi} from 'vitest';import App from '../../src/app/App';
vi.mock('../../src/genlayer/client',async()=>{const actual=await vi.importActual<Record<string,unknown>>('../../src/genlayer/client');return{...actual,listEntries:vi.fn().mockResolvedValue({entries:[],next_cursor:0,has_more:false}),configured:()=>false}});
describe('read-only atlas',()=>{it('renders an honest empty state without fabricated records',async()=>{render(<App/>);expect(await screen.findByText(/atlas is waiting/i)).toBeInTheDocument();expect(screen.getByText(/nothing has been staged/i)).toBeInTheDocument()})});
