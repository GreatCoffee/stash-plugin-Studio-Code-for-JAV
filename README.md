# Studio Code for JAV

**[English](#english)** | **[中文](#chinese)**

---

<a id="chinese"></a>

# 中文

## 简介

一款 [Stash](https://stashapp.cc/) 插件，用于在短片（Scenes）界面显示短片的工作室编号（Studio Code）。

- 在**短片卡片（Scene Card）**的右下角显示工作室编号，字号与短片标题一致。
- 在**列表视图**的封面图片与标题之间插入一列"编号"。
- 对于缺少工作室编号的短片，则显示其工作室名称。
- 对于缺少工作室编号且同时缺少工作室名称的短片，则显示 `(Unknown)`。

> **适用场景**
>
> 主要适用于 JAV 类内容。对于非 JAV 类短片来说，本插件是画蛇添足。

> **⚠️ 注意**
>
> 我完全不懂写代码，而是使用 AI（GLM-5.2）完成了全部工作。代码没有经过任何审查，我也无法对安全性做任何保证，因此在任何情况下都不建议使用此插件。

## 功能

- **网格视图（Grid view）** — 在每张短片卡片的右下角显示工作室编号，字号与短片标题一致。
- **列表视图（List view）** — 在封面图片列与标题列之间插入一列"编号"，显示同样的内容。
- **三级回退** — 场景编号 `Scene Code` → 工作室名称 `Studio Name` → `(Unknown)`

## 安装

将仓库中的 `StudioCodeForJAV.yml`、`studioCodeForJAV.js`、`studioCodeForJAV.css` 三个文件放入
Stash 的插件目录 `plugins/StudioCodeForJAV/` 下，然后点击 **重新加载插件（Reload plugins）**，
并**硬刷新浏览器**（Ctrl+F5）。

插件目录的默认位置：

| 系统 | 路径 |
| --- | --- |
| Windows | `%USERPROFILE%\.stash\plugins\` |
| Linux / macOS | `$HOME/.stash/plugins/` |

若你修改过 Stash 的 `config.yml` 路径，则以实际配置为准。

也可以直接克隆整个仓库到插件目录下：

```bash
git clone https://github.com/GreatCoffee/stash-plugin-Studio-Code-for-JAV.git \
  "$HOME/.stash/plugins/StudioCodeForJAV"
```

> **关于 `manifest` 文件**
>
> 仓库中的 `manifest` 文件仅用于让本插件出现在 Stash 的"已安装插件"列表中（从而可以使用界面内的卸载按钮）。
> 手动安装时若不需要卸载功能，可以忽略它。

## 实现说明

插件通过 `MutationObserver` 直接操作 DOM 注入元素，**不使用** `PluginApi.patch` 修补 React 组件。
在 Stash 的生产构建中，React 补丁会导致运行时崩溃（React error #31），因此采用纯 DOM 方案。

标签数据通过 Stash 的 GraphQL 端点批量获取：

```graphql
findScenes(ids: $ids) { scenes { id code studio { name } } }
```

## 兼容性

- 依赖 Stash **短片网格视图**与**列表视图**的 DOM 结构，以及短片的 `code` / `studio.name` 字段。
- Stash 前端升级若改变卡片或表格结构，插件可能失效；届时请提交 Issue。
- 浏览器需支持 `MutationObserver`、ES6 `Map` / `Set` 与 `:scope` 选择器（现代浏览器均可）。

## 文件

| 文件 | 说明 |
| --- | --- |
| `StudioCodeForJAV.yml` | 插件清单 |
| `studioCodeForJAV.js` | 界面注入逻辑 |
| `studioCodeForJAV.css` | 样式 |
| `manifest` | 包管理器元数据（便于在 Stash 中卸载） |

## 许可

[MIT](LICENSE) — 可自由使用、修改、再分发，包括商业用途，无需承担担保责任。

## 免责声明

本项目按"现状"提供，不对适用性或任何其他用途作出担保。作者与 AI 工具均不对使用本插件造成的任何损害承担责任。

---

<a id="english"></a>

# English

## Overview

A [Stash](https://stashapp.cc/) plugin that displays the studio code of a scene in the Scenes interface.

- Shows the studio code at the **bottom-right corner of each scene card**, at the same font size as the card title.
- Inserts a **"编号" (code) column** between the cover image and title columns in the **list view**.
- For scenes with no studio code, the studio name is shown instead.
- For scenes with neither a studio code nor a studio name, `(Unknown)` is shown.

> **Intended use**
>
> Mainly intended for JAV content. For non-JAV material this plugin adds nothing but noise.

> **⚠️ Warning**
>
> I know nothing about writing code; this entire plugin was produced by an AI (GLM-5.2). The code has not been reviewed by anyone, and I cannot make any guarantee about its safety. Under no circumstances do I recommend using this plugin.

## Features

- **Grid view** — shows the studio code at the bottom-right corner of each scene card, at the same font size as the card title.
- **List view** — inserts a "编号" (code) column between the cover image and title columns, showing the same label.
- **Three-step fallback** — Scene Code → Studio Name → `(Unknown)`

## Installation

Copy `StudioCodeForJAV.yml`, `studioCodeForJAV.js` and `studioCodeForJAV.css` into the Stash
plugins directory as `plugins/StudioCodeForJAV/`, then click **Reload plugins** on the
**Settings → Plugins** page and **hard-refresh the browser** (Ctrl+F5).

Default location of the plugins directory:

| OS | Path |
| --- | --- |
| Windows | `%USERPROFILE%\.stash\plugins\` |
| Linux / macOS | `$HOME/.stash/plugins/` |

If you have changed the Stash config path, use your actual path.

You can also clone the whole repository into the plugins directory:

```bash
git clone https://github.com/GreatCoffee/stash-plugin-Studio-Code-for-JAV.git \
  "$HOME/.stash/plugins/StudioCodeForJAV"
```

> **About the `manifest` file**
>
> The `manifest` file in this repository only exists so that the plugin shows up under
> "Installed Plugins" in Stash, which enables the uninstall button. You can ignore it when
> installing manually.

## Implementation notes

The plugin injects elements directly into the DOM via a `MutationObserver` and does **not** patch React
components through `PluginApi.patch`. React patching crashes at runtime (React error #31) in Stash's
production build, hence the pure-DOM approach.

Labels are fetched in batches through Stash's GraphQL endpoint:

```graphql
findScenes(ids: $ids) { scenes { id code studio { name } } }
```

## Compatibility

- Relies on the DOM structure of Stash's Scenes grid and list views, and on the scene `code` / `studio.name` fields.
- If a future Stash release changes the card or table structure, the plugin may stop working — please open an issue in that case.
- Requires a browser with `MutationObserver`, ES6 `Map` / `Set` and `:scope` selector support (any modern browser).

## Files

| File | Description |
| --- | --- |
| `StudioCodeForJAV.yml` | Plugin manifest |
| `studioCodeForJAV.js` | UI injection logic |
| `studioCodeForJAV.css` | Styles |
| `manifest` | Package-manager metadata (enables uninstall in Stash) |

## License

[MIT](LICENSE) — free to use, modify and redistribute, including commercially, with no warranty liability.

## Disclaimer

The project is provided "as is", without warranty of any kind. Neither the author nor the AI tool that
generated it is liable for any damages arising from the use of this plugin.
