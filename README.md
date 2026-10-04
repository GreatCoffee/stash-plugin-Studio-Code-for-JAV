# Stash 插件 - Studio Code for JAV
# Stash Plugin - Studio Code for JAV

在短片（Scenes）界面的短片卡片（Scene Card）和列表中显示短片的工作室编号（Studio Code）。
Displays the studio code of a scene on its scene card and in the list view, in the Scenes interface.

对于缺少工作室编号的短片，则显示其工作室名称。
For scenes with no studio code, the studio name is shown instead.

对于缺少工作室编号且同时缺少工作室名称的短片，则显示"(Unknown)"。
For scenes with neither a studio code nor a studio name, `(Unknown)` is shown.

主要适用于JAV，对于非JAV类短片来说是画蛇添足。
It is mainly intended for JAV content; for non-JAV material it adds nothing but noise.

> **注意 / Warning**
>
> 我完全不懂写代码，而是使用AI（GLM-5.2）完成了全部工作。代码没有经过任何审查，我也无法对安全性做任何保证，因此在任何情况下都不建议使用此插件。
>
> I know nothing about writing code; this entire plugin was produced by an AI (GLM-5.2). The code has not been reviewed by anyone, and I cannot make any guarantee about its safety. Under no circumstances do I recommend using this plugin.

---

## 功能 / Features

- **网格视图（Grid view）** — 在每张短片卡片的右下角显示工作室编号，字号与短片标题一致。
  **Grid view** — shows the studio code at the bottom-right corner of each scene card, at the same font size as the card title.
- **列表视图（List view）** — 在封面图片与标题之间插入一列"编号"。
  **List view** — inserts a "编号" (code) column between the cover image and the title columns.
- **回退顺序 / Fallback chain** — `Scene Code` → `Studio Name` → `(Unknown)`

## 安装 / Installation

将仓库中的 `StudioCodeForJAV.yml`、`studioCodeForJAV.js`、`studioCodeForJAV.css` 三个文件放入
Stash 的插件目录（Windows 默认 `%USERPROFILE%\.stash\plugins\StudioCodeForJAV\`），
然后在 **设置 → 插件** 页面点击 **重新加载插件（Reload plugins）**，并**硬刷新浏览器**（Ctrl+F5）。

Copy `StudioCodeForJAV.yml`, `studioCodeForJAV.js` and `studioCodeForJAV.css` into the Stash
plugins directory (by default `%USERPROFILE%\.stash\plugins\StudioCodeForJAV\` on Windows),
then click **Reload plugins** on the **Settings → Plugins** page and **hard-refresh the browser** (Ctrl+F5).

## 实现说明 / Implementation notes

插件通过 `MutationObserver` 直接操作 DOM 注入元素，不使用 `PluginApi.patch` 修补 React 组件。
在 Stash 的生产构建中，React 补丁会导致运行时崩溃（React error #31），因此采用纯 DOM 方案。

The plugin injects elements directly into the DOM via a `MutationObserver` and does **not** patch React
components through `PluginApi.patch`. React patching crashes at runtime (React error #31) in Stash's
production build, hence the pure-DOM approach.

标签数据通过 Stash 的 GraphQL 端点批量获取：
`findScenes(ids: $ids) { scenes { id code studio { name } } }`

Labels are fetched in batches through Stash's GraphQL endpoint.

## 许可 / License

[MIT](LICENSE) — 可自由使用、修改、再分发，包括商业用途，无需承担担保责任。
[MIT](LICENSE) — free to use, modify and redistribute, including commercially, with no warranty liability.

## 免责声明 / Disclaimer

本项目按"现状"提供，不对适性或任何其他用途作出担保。作者与 AI 工具均不对使用本插件造成的任何损害承担责任。
The project is provided "as is", without warranty of any kind. Neither the author nor the AI tool that
generated it is liable for any damages arising from the use of this plugin.
