/**
 * validate-practice.js
 * 校验 practice/ 下的训练营练习提交（语言无关）。
 * 既可本地运行，也作为 CI 判题门禁。
 *
 * 一次提交 = 一个「单语言项目」：项目根目录下有
 *   - 语言入口文件（main.py / main.js / Main.java / Program.cs / main.cpp 之一）
 *   - plugin_manifest.json / FuncList.json / README.md / logo.png
 *   - 打包的 SDK（knotlink/ 或 knotlink-sdk/）与构建文件（不校验，学习者不用改）
 *
 * 用法: node validate-practice.js
 * 退出码: 0 = 全部通过, 1 = 有错误
 */

const fs = require('fs');
const path = require('path');

const PRACTICE_DIR = path.join(__dirname, 'practice');
const MARKER = '___FILL_THIS___';
// AppID：新格式=倒置域名（如 com.github.用户.项目），旧格式=0x+8位十六进制（兼容）
const APPID_RE = /^(0x[0-9A-Fa-f]{8}|[A-Za-z][A-Za-z0-9]*(\.[A-Za-z0-9][A-Za-z0-9_-]*)+)$/;
const ENTRY_FILES = ['main.py', 'main.js', 'Main.java', 'Program.cs', 'main.cpp'];
const META_FILES = ['plugin_manifest.json', 'FuncList.json', 'logo.png', 'README.md'];

let errors = 0;
let warnings = 0;
const summary = [];

function error(msg) { console.error(`  ❌ ${msg}`); errors++; summary.push(`- ❌ ${msg}`); }
function warn(msg) { console.warn(`  ⚠️  ${msg}`); warnings++; summary.push(`- ⚠️ ${msg}`); }
function ok(msg) { console.log(`  ✅ ${msg}`); }

function readText(p) {
    try { return fs.readFileSync(p, 'utf-8'); } catch (e) { return null; }
}

function validateSubmission(name, dir) {
    console.log(`\n📦 practice/${name}`);
    const tag = `[${name}]`;
    const errBefore = errors;

    // 1. 必需元数据文件（项目根目录）
    for (const f of META_FILES) {
        if (!fs.existsSync(path.join(dir, f))) error(`${tag} 缺少必需文件: ${f}`);
    }

    // 2. 语言入口文件（项目根目录，应恰好一个）
    const entries = ENTRY_FILES.filter(f => fs.existsSync(path.join(dir, f)));
    if (entries.length === 0) {
        error(`${tag} 找不到语言入口文件（${ENTRY_FILES.join(' / ')}）——请从 _exercise 里拷一个语言项目文件夹`);
    } else if (entries.length > 1) {
        warn(`${tag} 同时存在多个语言入口（${entries.join(', ')}）；一个项目只应有一种语言`);
    }

    // 3. 占位符残留检查（核心判分；只查学习者要填的文件，不查打包的 SDK）
    const textFiles = [
        path.join(dir, 'plugin_manifest.json'),
        path.join(dir, 'FuncList.json'),
        path.join(dir, 'README.md'),
        ...entries.map(f => path.join(dir, f)),
    ];
    for (const p of textFiles) {
        const t = readText(p);
        if (t !== null && t.includes(MARKER)) {
            error(`${tag} ${path.basename(p)} 还有没填的空 ${MARKER}`);
        }
    }

    // 4. JSON 解析
    let manifest = null, funcList = null;
    const mText = readText(path.join(dir, 'plugin_manifest.json'));
    const fText = readText(path.join(dir, 'FuncList.json'));
    if (mText !== null) { try { manifest = JSON.parse(mText); } catch (e) { error(`${tag} plugin_manifest.json 解析失败: ${e.message}`); } }
    if (fText !== null) { try { funcList = JSON.parse(fText); } catch (e) { error(`${tag} FuncList.json 解析失败: ${e.message}`); } }

    // 5. app_id 格式 / 未个性化占位
    if (manifest && manifest.app_id) {
        if (manifest.app_id.includes('你的用户名')) {
            error(`${tag} app_id 还是模板占位——请把「你的用户名」换成你自己的，如 com.github.zhangsan.msgreminder`);
        } else if (!APPID_RE.test(manifest.app_id)) {
            error(`${tag} app_id 格式不对: ${manifest.app_id}（推荐倒置域名如 com.github.<用户名>.msgreminder，或旧格式 0x+8位十六进制）`);
        }
    }

    // 6. 跨文件一致性
    if (manifest && funcList) {
        const appId = manifest.app_id;
        const showMsg = funcList.openSocket && funcList.openSocket.ShowMsg;
        const sig = funcList.signal && funcList.signal.messageShown;

        if (!showMsg) error(`${tag} FuncList 缺少 openSocket.ShowMsg 接口`);
        if (!sig) error(`${tag} FuncList 缺少 signal.messageShown 信号`);

        if (showMsg && appId && showMsg.appID !== appId) {
            error(`${tag} ShowMsg.appID (${showMsg.appID}) 与 manifest.app_id (${appId}) 不一致`);
        }
        if (sig && appId && sig.appID !== appId) {
            error(`${tag} messageShown.appID (${sig.appID}) 与 manifest.app_id (${appId}) 不一致`);
        }
        if (funcList.appName && manifest.plugin_name && funcList.appName !== manifest.plugin_name) {
            error(`${tag} FuncList.appName (${funcList.appName}) 与 manifest.plugin_name (${manifest.plugin_name}) 不一致`);
        }
        if (sig && sig.returns && Array.isArray(sig.returns)) {
            error(`${tag} signal.messageShown.returns 必须是对象格式 { "字段": { "description": "..." } }，不是数组`);
        }

        // 代码里必须出现三个 ID（代码与配置一致）
        const oid = showMsg && showMsg.openSocketID;
        const sid = sig && sig.signalID;
        for (const f of entries) {
            const code = readText(path.join(dir, f)) || '';
            if (code.includes(MARKER)) continue; // 占位符已单独报错
            if (appId && !code.includes(appId)) error(`${tag} ${f} 里没有出现 AppID ${appId}（代码与配置要一致）`);
            if (oid && !code.includes(oid)) error(`${tag} ${f} 里没有出现接口ID ${oid}`);
            if (sid && !code.includes(sid)) error(`${tag} ${f} 里没有出现信号ID ${sid}`);
        }
    }

    // 7. README 链接
    const readme = readText(path.join(dir, 'README.md')) || '';
    if (!/https?:\/\//.test(readme)) error(`${tag} README.md 缺少 http(s) 链接（下载/官网地址）`);

    // 8. logo 大小
    const logo = path.join(dir, 'logo.png');
    if (fs.existsSync(logo) && fs.statSync(logo).size < 1024) {
        warn(`${tag} logo.png 小于 1KB，可能不是有效图片`);
    }

    if (errors === errBefore) ok(`${tag} 通过`);
}

// ============ 主流程 ============
console.log('🎓 KnotLink 训练营 — 练习校验\n');

if (!fs.existsSync(PRACTICE_DIR)) {
    console.log('practice/ 目录不存在，跳过。');
    process.exit(0);
}

const subs = fs.readdirSync(PRACTICE_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.'));

if (subs.length === 0) {
    console.log('practice/ 下暂无练习提交。');
    process.exit(0);
}

for (const e of subs) validateSubmission(e.name, path.join(PRACTICE_DIR, e.name));

console.log('\n═══════════════════════════════');
console.log(`练习提交: ${subs.length}  错误: ${errors}  警告: ${warnings}`);

if (process.env.GITHUB_STEP_SUMMARY) {
    const head = errors > 0 ? '## ❌ 训练营校验未通过' : '## ✅ 训练营校验通过';
    const lines = summary.length ? summary : ['- 一切正常，没有发现问题'];
    const body = [head, '', ...lines, '', `提交: ${subs.length} · 错误: ${errors} · 警告: ${warnings}`, ''].join('\n');
    try { fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, body + '\n'); } catch (e) { /* ignore */ }
}

if (errors > 0) {
    console.log('\n❌ 校验未通过，请修复上述错误后重新提交。');
    process.exit(1);
}
console.log('\n✅ 全部通过！你已完成一次 KnotLink 接入练习。');
process.exit(0);
