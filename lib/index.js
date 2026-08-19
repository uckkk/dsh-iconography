// dsh-iconography — 图标设计规范：风格、栅格、绘制要点。纯 Node 知识库。
import { defineTool } from "@deepseek-ai/dsh-tools";

const name = "图标设计";
const inject = ["tools"];

const STYLES = [
  { id: "line", name: "线性图标", en: "Line/Outlined", desc: "单一线条勾勒，轻盈现代，UI 最常用。", tips: "统一描边粗细（如 1.5/2px）与圆角端点。" },
  { id: "filled", name: "面性图标", en: "Filled", desc: "实心填充，更醒目、体量感强。", tips: "用于强调或选中态，与线性形成主次。" },
  { id: "duotone", name: "双色调", en: "Duotone", desc: "两色叠加，层次丰富、品牌感强。", tips: "主色 + 低透明副色，控制颜色数量。" },
  { id: "colored", name: "彩色图标", en: "Colored", desc: "多色写实，识别度高、活泼。", tips: "适合品牌/功能入口，避免过于花哨。" },
  { id: "glyph", name: "字形/字体图标", en: "Glyph", desc: "以字体呈现，缩放无损、体积小。", tips: "注意基线对齐与字重一致。" },
];

const GRID = [
  { step: "画布", desc: "常用 24×24 或 16×16 标准画布，统一所有图标。" },
  { step: "安全区", desc: "图标主体放在中间 20×20（24 画布）内，四周留 2px 出血余量。" },
  { step: "对齐", desc: "圆形图标需稍微放大、方形收小，保证视觉重量一致。" },
  { step: "关键线", desc: "尽量对齐像素网格（整数坐标），保证 1x 下清晰。" },
  { step: "描边", desc: "线性图标描边 1.5-2px，端点与转角统一（圆角/直角）。" },
];

const RULES = [
  "一套图标只用一种风格，不混用线性与面性。",
  "透视一致：统一正视/侧视/等距，不混视角。",
  "细节与尺寸匹配：小尺寸用更简单的形状。",
  "留白均衡：图形密度相近，视觉重量一致。",
  "命名规范：统一语义命名（如 icon-search / icon-user）。",
  "测试：在真实尺寸（16/24px）与深浅背景上检查可读性。",
];

async function apply(ctx, _config) {
  ctx.tools.register(defineTool({
    name: "list_icon_styles",
    description: "列出图标风格类型（线性/面性/双色调/彩色/字形），含说明与要点。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: {
          count: { type: "integer", required: true },
          styles: { type: "array", required: true, items: { type: "object", additionalProperties: false, properties: { id: { type: "string", required: true }, name: { type: "string", required: true }, en: { type: "string", required: true }, desc: { type: "string", required: true }, tips: { type: "string", required: true } } } },
        },
      },
      render: (_a, v) => [{ type: "text", text: v.styles.map((s) => `- ${s.name}（${s.en}）：${s.desc}。${s.tips}`).join("\n") }],
    },
    execute: async () => ({ count: STYLES.length, styles: STYLES.map((s) => ({ ...s })) }),
  }));

  ctx.tools.register(defineTool({
    name: "icon_grid_guide",
    description: "返回图标栅格绘制要点（画布尺寸、安全区、对齐、关键线、描边）。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: { grid: { type: "array", required: true, items: { type: "object", additionalProperties: false, properties: { step: { type: "string", required: true }, desc: { type: "string", required: true } } } } },
      },
      render: (_a, v) => [{ type: "text", text: v.grid.map((g) => `- ${g.step}：${g.desc}`).join("\n") }],
    },
    execute: async () => ({ grid: GRID.map((g) => ({ ...g })) }),
  }));

  ctx.tools.register(defineTool({
    name: "icon_rules",
    description: "返回一套图标设计的一致性规范（风格统一/透视/细节/留白/命名/测试）。",
    parameters: {},
    output: {
      schema: {
        type: "object", additionalProperties: false,
        properties: { rules: { type: "array", required: true, items: { type: "string" } } },
      },
      render: (_a, v) => [{ type: "text", text: "图标设计规范：\n" + v.rules.map((r) => "  - " + r).join("\n") }],
    },
    execute: async () => ({ rules: RULES.map((r) => r) }),
  }));
}

export { apply, inject, name };
