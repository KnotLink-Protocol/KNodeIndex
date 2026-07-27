/*
 * KLKVMap — KnotLink 键值对数据格式（KLUDF）工具
 * 格式：key1=value1;key2=value2
 *
 * ⚠️ 训练营补充：官方 knotlink-sdk-js 尚未内置此类，这里为对齐其他语言
 *    （Python / C# / C++ 的 KLKVMap）而提供，API 保持一致。
 */
class KLKVMap {
    constructor() { this._map = {}; }

    // 设置一个键值对
    set(key, value) { this._map[key] = value; return this; }

    // 安全读取；键不存在时返回 defaultVal
    get(key, defaultVal = "") {
        return Object.prototype.hasOwnProperty.call(this._map, key) ? this._map[key] : defaultVal;
    }

    // 序列化为 key1=value1;key2=value2
    serialize() {
        return Object.entries(this._map).map(([k, v]) => `${k}=${v}`).join(';');
    }

    // 从 key1=value1;key2=value2 反序列化
    deserialize(str) {
        this._map = {};
        if (!str) return;
        for (const pair of str.split(';')) {
            if (!pair) continue;
            const i = pair.indexOf('=');
            if (i >= 0) this._map[pair.slice(0, i)] = pair.slice(i + 1);
        }
    }
}

module.exports = KLKVMap;
