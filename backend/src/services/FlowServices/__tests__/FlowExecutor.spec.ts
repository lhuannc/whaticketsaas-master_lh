import {
  findNode,
  findNextNode,
  resolveMenuTarget
} from "../FlowGraph";

const nodes: any[] = [
  { id: "start", type: "start", data: {} },
  { id: "msg1", type: "message", data: { text: "Olá" } },
  {
    id: "menu1",
    type: "menu",
    data: {
      text: "Escolha:",
      options: [
        { key: "1", label: "Vendas", target: "qVendas" },
        { key: "2", label: "Suporte", target: "qSuporte" }
      ]
    }
  },
  { id: "qVendas", type: "queue", data: { queueId: 10 } },
  { id: "qSuporte", type: "queue", data: { queueId: 20 } },
  { id: "fim", type: "end", data: {} }
];

const edges: any[] = [
  { id: "e1", source: "start", target: "msg1" },
  { id: "e2", source: "msg1", target: "menu1" }
];

describe("FlowExecutorService helpers", () => {
  it("findNode encontra node por id", () => {
    expect(findNode(nodes, "menu1")?.type).toBe("menu");
    expect(findNode(nodes, "inexistente")).toBeUndefined();
  });

  it("findNextNode segue edge linear", () => {
    expect(findNextNode(nodes, edges, "start")?.id).toBe("msg1");
    expect(findNextNode(nodes, edges, "msg1")?.id).toBe("menu1");
  });

  it("findNextNode retorna undefined sem edge", () => {
    expect(findNextNode(nodes, edges, "menu1")).toBeUndefined();
  });

  it("resolveMenuTarget roteia pela opção escolhida", () => {
    const menu = findNode(nodes, "menu1")!;
    expect(resolveMenuTarget(menu, nodes, edges, "1")?.id).toBe("qVendas");
    expect(resolveMenuTarget(menu, nodes, edges, "2")?.id).toBe("qSuporte");
  });

  it("resolveMenuTarget ignora espaços na escolha", () => {
    const menu = findNode(nodes, "menu1")!;
    expect(resolveMenuTarget(menu, nodes, edges, " 1 ")?.id).toBe("qVendas");
  });

  it("resolveMenuTarget cai no próximo node (edge) se opção inválida", () => {
    const menu = findNode(nodes, "menu1")!;
    // menu1 não tem edge de saída → opção inválida retorna undefined
    expect(resolveMenuTarget(menu, nodes, edges, "9")).toBeUndefined();
  });
});
