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
Stash 的插件目录 `plugins/StudioCodeForJAV/` 下（默认路径为 Windows 下的 `%USERPROFILE%\.stash\plugins\`，
Linux/macOS 下为 `$HOME/.stash/plugins/`；若你修改过 Stash 的 `config.yml` 路径，则以实际配置为准），
然后在 **设置 → 插件** 页面点击 **重新加载插件（Reload plugins）**，并**硬刷新浏览器**（Ctrl+F5）。

> 仓库中的 `manifest` 文件仅用于让本插件出现在 Stash 的"已安装插件"列表中（便于卸载），
> 手动安装时若不需要卸载功能可以忽略它。

Copy `StudioCodeForJAV.yml`, `studioCodeForJAV.js` and `studioCodeForJAV.css` into the Stash
plugins directory as `plugins/StudioCodeForJAV/` (by default `%USERPROFILE%\.stash\plugins\` on Windows,
`$HOME/.stash/plugins/` on Linux/macOS; if you have changed the Stash config path, use your actual path),
then click **Reload plugins** on the **Settings → Plugins** page and **hard-refresh the browser** (Ctrl+F5).

> The `manifest` file in this repository only exists so that the plugin shows up under
> "Installed Plugins" in Stash (which makes it uninstallable). You can ignore it when installing manually.

也可以直接克隆整个仓库到插件目录下：

```bash
git clone https://github.com/GreatCoffee/stash-plugin-Studio-Code-for-JAV.git \
  "$HOME/.stash/plugins/StudioCodeForJAV"
```

Or clone the whole repository into the plugins directory:

```bash
git clone https://github.com/GreatCoffee/stash-plugin-Studio-Code-for-JAV.git \
  "$HOME/.stash/plugins/StudioCodeForJAV"
```

## 实现说明 / Implementation notes

插件通过 `MutationObserver` 直接操作 DOM 注入元素，不使用 `PluginApi.patch` 修补 React 组件。
在 Stash 的生产构建中，React 补丁会导致运行时崩溃（React error #31），因此采用纯 DOM 方案。

The plugin injects elements directly into the DOM via a `MutationObserver` and does **not** patch React
components through `PluginApi.patch`. React patching crashes at runtime (React error #31) in Stash's
production build, hence the pure-DOM approach.

标签数据通过 Stash 的 GraphQL 端点批量获取：
`findScenes(ids: $ids) { scenes { id code studio { name } } }`

Labels are fetched in batches through Stash's GraphQL endpoint.

## 兼容性 / Compatibility

- 依赖 Stash 的 **Scenes 网格视图**与**列表视图**DOM 结构，以及短片的 `code` / `studio.name` 字段。
- Stash 前端升级若改变卡片或表格结构，插件可能失效；此时请提Issue。
- 浏览器需支持 `MutationObserver`、ES6 `Map` / `Set` 与 `:scope` 选择器（现代浏览器均可）。

Relies on the DOM structure of Stash's Scenes grid and list views, and on the scene
`code` / `studio.name` fields. If a future Stash release changes that structure the plugin may
stop working — please open an issue if that happens. Requires a browser with `MutationObserver`,
ES6 `Map` / `Set` and `:scope` selector support (any modern browser).

## 文件 / Files

| 文件 / File | 说明 / Description |
| --- | --- |
| `StudioCodeForJAV.yml` | 插件清单 / Plugin manifest |
| `studioCodeForJAV.js` | 界面注入逻辑 / UI injection logic |
| `studioCodeForJAV.css` | 样式 / Styles |
| `manifest` | 包管理器元数据（便于在 Stash 中卸载）/ Package-manager metadata (enables uninstall in Stash) |

## 许可 / License

[MIT](LICENSE) — 可自由使用、修改、再分发，包括商业用途，无需承担担保责任。
[MIT](LICENSE) — free to use, modify and redistribute, including commercially, with no warranty liability.

## 免责声明 / Disclaimer

本项目按"现状"提供，不对适性或任何其他用途作出担保。作者与 AI 工具均不对使用本插件造成的任何损害承担责任。
The project is provided "as is", without warranty of any kind. Neither the author nor the AI tool that
generated it is liable for any damages arising from the use of this plugin.
