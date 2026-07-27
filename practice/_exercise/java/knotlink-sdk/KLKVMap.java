/*
 * KLKVMap — KnotLink 键值对数据格式（KLUDF）工具
 * 格式：key1=value1;key2=value2
 *
 * ⚠️ 训练营补充：官方 knotlink-sdk-java 尚未内置此类，这里为对齐其他语言
 *    （Python / C# / C++ 的 KLKVMap）而提供，API 保持一致。
 */
import java.util.LinkedHashMap;

public class KLKVMap extends LinkedHashMap<String, String> {

    // 序列化为 key1=value1;key2=value2
    public String serialize() {
        StringBuilder sb = new StringBuilder();
        boolean first = true;
        for (var e : entrySet()) {
            if (!first) sb.append(';');
            sb.append(e.getKey()).append('=').append(e.getValue());
            first = false;
        }
        return sb.toString();
    }

    // 从 key1=value1;key2=value2 反序列化
    public void deserialize(String s) {
        clear();
        if (s == null || s.isEmpty()) return;
        for (String pair : s.split(";")) {
            if (pair.isEmpty()) continue;
            int i = pair.indexOf('=');
            if (i >= 0) put(pair.substring(0, i), pair.substring(i + 1));
        }
    }

    // 安全读取；键不存在时返回 defaultVal
    public String get(String key, String defaultVal) {
        String v = super.get(key);
        return v != null ? v : defaultVal;
    }
}
