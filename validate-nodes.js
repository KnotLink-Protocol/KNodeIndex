/**
 * validate-nodes.js
 * 验证 nodes/ 目录下所有节点的格式完整性
 * 作为 CI 检查的第一步，也可本地运行
 *
 * 用法: node validate-nodes.js
 * 退出码: 0 = 全部通过, 1 = 有错误
 */

const fs = require('fs');
const path = require('path');

const NODES_DIR = __dirname;
const VALID_TYPES = ['plugin', 'standalone'];
const REQUIRED_FILES = {
    plugin: ['plugin_manifest.json', 'FuncList.json', 'logo.png'],
    standalone: ['FuncList.json', 'logo.png'], // manifest 可选，允许其他命名
};
const MANIFEST_FIELDS = ['app_id', 'plugin_name', 'author', 'version', 'description'];

let errors = 0;
let warnings = 0;

function error(msg) { console.error(`  ❌ ${msg}`); errors++; }
function warn(msg) { console.warn(`  ⚠️  ${msg}`); warnings++; }
function ok(msg) { console.log(`  ✅ ${msg}`); }

function validate() {
    console.log('🔍 KnotLink 节点校验\n');

    if (!fs.existsSync(NODES_DIR)) {
        error('plugin/ 或 standalone/ 目录不存在');
        process.exit(1);
    }

    let totalNodes = 0;

    for (const type of VALID_TYPES) {
        const typeDir = path.join(NODES_DIR, type);
        console.log(`📁 nodes/${type}/`);

        if (!fs.existsSync(typeDir)) {
            warn(`目录不存在，跳过`);
            continue;
        }

        const entries = fs.readdirSync(typeDir, { withFileTypes: true })
            .filter(e => e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.'));

        if (entries.length === 0) {
            console.log('  (空)');
            continue;
        }

        const required = REQUIRED_FILES[type];

        for (const entry of entries) {
            totalNodes++;
            const nodePath = path.join(typeDir, entry.name);
            console.log(`  📦 ${entry.name}`);

            // 检查必需文件
            for (const file of required) {
                if (!fs.existsSync(path.join(nodePath, file))) {
                    error(`缺少必需文件: ${file}`);
                }
            }

            // 验证 manifest
            const manifestPath = path.join(nodePath, 'plugin_manifest.json');
            const standaloneManifestPath = path.join(nodePath, 'standalone_manifest.json');
            const manifestFile = fs.existsSync(manifestPath) ? manifestPath
                : fs.existsSync(standaloneManifestPath) ? standaloneManifestPath : null;

            if (manifestFile) {
                try {
                    const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
                    for (const field of MANIFEST_FIELDS) {
                        if (!manifest[field]) {
                            warn(`${path.basename(manifestFile)} 缺少字段: ${field}`);
                        }
                    }
                    // 验证 app_id 格式
                    if (manifest.app_id && !/^0x[0-9A-Fa-f]{8}$/.test(manifest.app_id)) {
                        warn(`app_id 格式异常: ${manifest.app_id}（应为 0x 开头 + 8 位十六进制）`);
                    }
                } catch (e) {
                    error(`${path.basename(manifestFile)} JSON 解析失败: ${e.message}`);
                }
            } else if (type === 'plugin') {
                error('须有 plugin_manifest.json');
            }

            // 验证 FuncList
            const funcListPath = path.join(nodePath, 'FuncList.json');
            if (fs.existsSync(funcListPath)) {
                try {
                    const funcList = JSON.parse(fs.readFileSync(funcListPath, 'utf-8'));

                    // 检查 appName 与 manifest 中的 plugin_name 一致
                    if (manifestFile) {
                        try {
                            const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
                            if (funcList.appName && manifest.plugin_name && funcList.appName !== manifest.plugin_name) {
                                warn(`FuncList.appName ("${funcList.appName}") 与 manifest.plugin_name ("${manifest.plugin_name}") 不一致`);
                            }
                        } catch (e) { /* already reported */ }
                    }

                    // 检查顶层元字段
                    if (!funcList.specVersion) {
                        error('FuncList 缺少 specVersion（遵循的规范版本，如 "1.0"）');
                    }
                    if (!funcList.manifestVersion) {
                        error('FuncList 缺少 manifestVersion（清单自身版本号，如 "1.0.0"）');
                    }

                    // 检查 openSocket
                    if (funcList.openSocket) {
                        for (const [name, sock] of Object.entries(funcList.openSocket)) {
                            if (!sock.openSocketID) {
                                warn(`接口 "${name}" 缺少 openSocketID`);
                            }
                            if (!sock.description) {
                                warn(`接口 "${name}" 缺少 description`);
                            }
                            // 验证 ID 格式
                            if (sock.openSocketID && !/^0x[0-9A-Fa-f]{8}$/.test(sock.openSocketID)) {
                                warn(`接口 "${name}" openSocketID 格式异常: ${sock.openSocketID}`);
                            }
                        }
                    } else {
                        warn('FuncList 中无 openSocket 定义');
                    }

                    // 检查 signal 中的 returns
                    if (funcList.signal) {
                        for (const [name, sig] of Object.entries(funcList.signal)) {
                            if (!sig.description) {
                                warn(`信号 "${name}" 缺少 description`);
                            }
                        }
                    }
                } catch (e) {
                    error(`FuncList.json JSON 解析失败: ${e.message}`);
                }
            }

            // 验证 logo
            const logoPath = path.join(nodePath, 'logo.png');
            if (fs.existsSync(logoPath)) {
                const stat = fs.statSync(logoPath);
                if (stat.size < 1024) {
                    warn('logo.png 小于 1KB，可能不是有效图片');
                }
                if (stat.size > 1024 * 1024) {
                    warn('logo.png 超过 1MB，建议压缩');
                }
            }

            // 检查 README
            if (fs.existsSync(path.join(nodePath, 'README.md'))) {
                ok('README.md ✓');
            } else {
                warn('建议添加 README.md');
            }

            console.log('');
        }
    }

    // 汇总
    console.log('═══════════════════════════════');
    console.log(`节点总数: ${totalNodes}`);
    console.log(`错误: ${errors}  警告: ${warnings}`);

    if (errors > 0) {
        console.log('\n❌ 校验未通过，请修复上述错误后重新提交。');
        process.exit(1);
    } else if (warnings > 0) {
        console.log('\n⚠️  校验通过（有警告，建议修复）');
        process.exit(0);
    } else {
        console.log('\n✅ 全部通过！');
        process.exit(0);
    }
}

validate();
