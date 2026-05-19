import { useState, useEffect, useMemo } from "react";
import { 
  Eye, 
  Search, 
  History, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Upload, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Loader2,
  X,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Supplier, Link, MonitoringResult, MonitoringHistory } from "./types";

// --- Constants & Initial Data ---
const STORAGE_KEY_SUPPLIERS = "catalog_suppliers";
const STORAGE_KEY_MONITORING = "catalog_monitoring_data";
const STORAGE_KEY_HISTORY = "catalog_monitoring_history";

const INITIAL_DATA: Supplier[] = [
  { id: 1, kana: "あ", name: "アキレス", desc: "主な製品：ファインシェード（ハウス用遮光剤）、ファインシェード除去剤", links: [{ label: "公式サイト", url: "https://achilles.jp", primary: true }, { label: "Webカタログ", url: "https://achilles.jp", primary: false }] },
  { id: 2, kana: "あ", name: "安全興業", desc: "主な製品：採集コンテナ、あぜ板、雨水タンク、砂利どめーる", links: [{ label: "公式サイト", url: "https://anzenkogyo.com", primary: true }, { label: "Webカタログ", url: "https://anzenkogyo.com", primary: false }] },
  { id: 3, kana: "い", name: "一色本店", desc: "主な製品：トルシーシリーズ（害虫捕獲）", links: [{ label: "公式サイト", url: "https://a117.co.jp", primary: true }, { label: "Webカタログ", url: "https://a117.co.jp/%E8%87%AA%E7%A4%BE%E8%A3%BD%E5%93%81/%E3%83%AA%E3%83%BC%E3%83%95%E3%83%AC%E3%83%83%E3%83%88/%E7%B7%8F%E5%90%88%E3%82%AB%E3%82%BF%E3%83%AD%E3%82%B0-vol.8.pdf", primary: false }] },
  { id: 4, kana: "い", name: "岩谷マテリアル", desc: "主な製品：アイホッカ、マルチフィルム", links: [{ label: "製品紹介ページ", url: "https://imcjpn.co.jp", primary: true }] },
  { id: 5, kana: "う", name: "槍木産業", desc: "主な製品：黒丸君、植えまき君、小型マキトール", links: [{ label: "主要製品ページ", url: "https://utsugi-industry.net", primary: true }] },
  { id: 6, kana: "え", name: "MKVアドバンス", desc: "主な製品：エバフロー、スソピー、パオパオ", links: [{ label: "カタログDLページ", url: "https://mkv-a.co.jp", primary: true }] },
  { id: 7, kana: "お", name: "OATアグリオ", desc: "主な製品：サンピ833neo、ホスプラス", links: [{ label: "製品案内", url: "https://oat-agrio.co.jp", primary: true }] },
  { id: 8, kana: "お", name: "オギハラ工業", desc: "主な製品：クリーントーミ、クリーンクリーナー", links: [{ label: "製品情報", url: "https://welcome-ogihara.com", primary: true }] },
  { id: 9, kana: "か", name: "環境技研", desc: "主な製品：米ガード、米ガードミニ", links: [{ label: "公式サイト", url: "https://kankyou-giken.com", primary: true }] },
  { id: 10, kana: "き", name: "貴志金物", desc: "（製品情報確認中）", links: [{ label: "公式サイト", url: "https://kishikk.com", primary: true }] },
  { id: 11, kana: "き", name: "キュウホー", desc: "主な製品：魔法のカルチ", links: [{ label: "製品・サービス", url: "https://q-hoe.com", primary: true }] },
  { id: 12, kana: "き", name: "キンボシ", desc: "主な製品：ゴールデンスター芝刈機", links: [{ label: "公式サイト", url: "https://golden-star.co.jp", primary: true }] },
  { id: 13, kana: "さ", name: "サカタのタネ", desc: "主な製品：ホスカル、ホストップ、ホスマグ", links: [{ label: "公式サイト", url: "https://sakataseed.co.jp", primary: true }, { label: "Webカタログ", url: "https://sakata-netshop.com", primary: false }] },
  { id: 14, kana: "さ", name: "住化アグリテック", desc: "主な製品：ミストエース、スミサンスイ", links: [{ label: "公式サイト", url: "https://sumika-agritech.co.jp", primary: true }] },
  { id: 15, kana: "さ", name: "サンポリ", desc: "主な製品：水番、アゼ板なみ、堆肥ワク", links: [{ label: "公式サイト", url: "https://sunpoly.jp", primary: true }] },
  { id: 16, kana: "さ", name: "サンホープ", desc: "主な製品：スクリーンフィルター、ディスクフィルター", links: [{ label: "公式サイト", url: "https://sunhope.com", primary: true }] },
  { id: 17, kana: "し", name: "シーム", desc: "主な製品：しちゅうキャッチ、くきたっちアルファ", links: [{ label: "公式サイト", url: "https://seem.jp", primary: true }] },
  { id: 18, kana: "し", name: "シンワ", desc: "主な製品：デジタル温度計、ウォーキングメジャー", links: [{ label: "公式サイト", url: "https://shinwasokutei.co.jp", primary: true }] },
  { id: 19, kana: "し", name: "シンセイ", desc: "主な製品：園芸支柱、あぜシート押さえ", links: [{ label: "製品一覧ページ", url: "https://trading-shinsei.co.jp", primary: true }] },
  { id: 20, kana: "す", name: "スイコー", desc: "主な製品：活魚タンク、薬注タンク", links: [{ label: "公式サイト", url: "https://e-suiko.co.jp", primary: true }] },
  { id: 21, kana: "ね", name: "根岸産業", desc: "主な製品：如雨露、ハス口", links: [{ label: "公式サイト", url: "https://jorro.jp", primary: true }] },
  { id: 22, kana: "は", name: "ハイポネックス", desc: "主な製品：ライゾー、ボンバルディア", links: [{ label: "公式サイト", url: "https://hyponex.co.jp", primary: true }] },
  { id: 23, kana: "は", name: "花ごころ", desc: "主な製品：高濃度フルボ酸活力液 T-1", links: [{ label: "公式サイト", url: "https://hanagokoro.co.jp", primary: true }] },
  { id: 24, kana: "は", name: "ハラックス", desc: "主な製品：ウエラック、アルステップ", links: [{ label: "公式サイト", url: "https://harax.co.jp", primary: true }] },
  { id: 25, kana: "ひ", name: "美膳", desc: "主な製品：はこらく、水田用溝切機", links: [{ label: "公式サイト", url: "https://kk-bizen.jp", primary: true }] },
  { id: 26, kana: "ひ", name: "広田産業", desc: "主な製品：みくに式種まき機", links: [{ label: "公式サイト", url: "http://hirota-sangyo.co.jp", primary: true }] },
  { id: 27, kana: "ふ", name: "福助", desc: "主な製品：ユニパック、ディプロ 除菌 ウェットワイパー", links: [{ label: "公式サイト", url: "https://fukusuke-kogyo.co.jp", primary: true }] },
  { id: 28, kana: "ふ", name: "フクトウ", desc: "みのるの部品表参考サイト", links: [{ label: "みのる部品表", url: "https://fukutou.co.jp", primary: true }] },
  { id: 29, kana: "ま", name: "マックス", desc: "主な製品：結束機テープナー、光分解テープ", links: [{ label: "公式サイト", url: "https://max-ltd.co.jp", primary: true }] },
  { id: 30, kana: "ま", name: "マリンプラスチック", desc: "主な製品：フレコン、くみたて槽", links: [{ label: "公式サイト", url: "https://n-m-p.net", primary: true }] },
  { id: 31, kana: "み", name: "みのる産業", desc: "主な製品：もち切機、追肥機、ステッキ注入機", links: [{ label: "公式サイト", url: "https://agri-style.com", primary: true }] },
  { id: 32, kana: "み", name: "未来のアグリ", desc: "（製品カタログ情報）", links: [{ label: "公式サイト", url: "https://mirai-no-agri.jp", primary: true }] },
];

export default function App() {
  // --- State ---
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [monitoringResults, setMonitoringResults] = useState<Record<string, MonitoringResult>>({});
  const [history, setHistory] = useState<MonitoringHistory[]>([]);
  const [activeKana, setActiveKana] = useState<string>("すべて");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string | null>(null);

  // --- Modal Form State ---
  const [formName, setFormName] = useState("");
  const [formKana, setFormKana] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formLinks, setFormLinks] = useState<Link[]>([]);

  // --- Initial Load ---
  useEffect(() => {
    const savedSuppliers = localStorage.getItem(STORAGE_KEY_SUPPLIERS);
    if (savedSuppliers) {
      setSuppliers(JSON.parse(savedSuppliers));
    } else {
      setSuppliers(INITIAL_DATA);
    }

    const savedMonitoring = localStorage.getItem(STORAGE_KEY_MONITORING);
    if (savedMonitoring) setMonitoringResults(JSON.parse(savedMonitoring));

    const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // --- Persistence ---
  const persistSuppliers = (data: Supplier[]) => {
    setSuppliers(data);
    localStorage.setItem(STORAGE_KEY_SUPPLIERS, JSON.stringify(data));
  };

  const persistMonitoring = (data: Record<string, MonitoringResult>) => {
    setMonitoringResults(data);
    localStorage.setItem(STORAGE_KEY_MONITORING, JSON.stringify(data));
  };

  const persistHistory = (data: MonitoringHistory[]) => {
    setHistory(data);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(data));
  };

  // --- Filtering & Sorting ---
  const kanaList = useMemo(() => {
    const uniqueKanas = Array.from(new Set(suppliers.map(s => s.kana))).sort();
    return ["すべて", ...uniqueKanas];
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    let result = [...suppliers].sort((a, b) => a.kana.localeCompare(b.kana, "ja") || a.name.localeCompare(b.name, "ja"));
    if (activeKana !== "すべて") {
      result = result.filter(s => s.kana === activeKana);
    }
    return result;
  }, [suppliers, activeKana]);

  // --- Monitoring Logic ---
  const checkUrl = async (supplier: Supplier, link: Link): Promise<MonitoringResult | null> => {
    try {
      const response = await fetch("/api/check-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link.url })
      });

      if (!response.ok) throw new Error("Server responded with " + response.status);
      return await response.json();
    } catch (error) {
      console.error("Monitoring failed for", link.url, error);
      return null;
    }
  };

  const startMonitoring = async () => {
    if (isMonitoring) return;
    setIsMonitoring(true);

    const newResults = { ...monitoringResults };
    const newHistory = [...history];

    // Get all links to check
    const tasks = suppliers.flatMap(s => 
      s.links.map(l => ({ supplier: s, link: l }))
    );

    for (const task of tasks) {
      const result = await checkUrl(task.supplier, task.link);
      const prev = monitoringResults[task.link.url];

      if (result) {
        let changeType: "changed" | "no_change" = "no_change";
        let detail = "";

        if (prev && (prev.etag !== result.etag || prev.contentLength !== result.contentLength)) {
          changeType = "changed";
          detail = `変更検知: ${prev.etag !== result.etag ? "ETag " : ""}${prev.contentLength !== result.contentLength ? "サイズ " : ""}が異なります`;
          
          newHistory.unshift({
            id: crypto.randomUUID(),
            supplierName: task.supplier.name,
            url: task.link.url,
            type: "changed",
            details: detail,
            timestamp: new Date().toLocaleString(),
            prevValue: prev.contentLength || "不明",
            newValue: result.contentLength || "不明"
          });
        }

        newResults[task.link.url] = result;
      } else {
        // Log error
        newHistory.unshift({
          id: crypto.randomUUID(),
          supplierName: task.supplier.name,
          url: task.link.url,
          type: "error",
          details: "接続エラーまたはタイムアウト",
          timestamp: new Date().toLocaleString()
        });
      }
    }

    persistMonitoring(newResults);
    persistHistory(newHistory.slice(0, 100)); // Keep last 100
    setIsMonitoring(false);
    setLastCheckTime(new Date().toLocaleString());
  };

  // --- UI Handlers ---
  const handleOpenAdd = () => {
    setFormName("");
    setFormKana("");
    setFormDesc("");
    setFormLinks([{ label: "公式サイト", url: "", primary: true }]);
    setShowModal("add");
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditingSupplier(s);
    setFormName(s.name);
    setFormKana(s.kana);
    setFormDesc(s.desc);
    setFormLinks([...s.links]);
    setShowModal("edit");
  };

  const saveSupplier = () => {
    if (!formName || !formKana) return;
    
    if (showModal === "edit" && editingSupplier) {
      const updated = suppliers.map(s => s.id === editingSupplier.id ? 
        { ...s, name: formName, kana: formKana, desc: formDesc, links: formLinks } : s
      );
      persistSuppliers(updated);
    } else {
      const newSupplier: Supplier = {
        id: Math.max(0, ...suppliers.map(s => s.id)) + 1,
        name: formName,
        kana: formKana,
        desc: formDesc,
        links: formLinks
      };
      persistSuppliers([...suppliers, newSupplier]);
    }
    setShowModal(null);
  };

  const deleteSupplier = (id: number) => {
    if (confirm("本当に削除しますか？")) {
      persistSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  const exportHistory = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `history_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Rendering Helpers ---
  const getStatus = (supplier: Supplier) => {
    const links = supplier.links;
    const stats = links.map(l => monitoringResults[l.url]);
    
    if (stats.some(s => s === undefined)) return "unconfirmed";
    // For simplicity, if check was performed, we mark as OK unless history says otherwise
    // Real implementation would compare last two results. 
    // Here we use history for last check alert.
    const hasChange = history.some(h => h.supplierName === supplier.name && h.type === "changed" && 
      new Date(h.timestamp) > new Date(Date.now() - 24*60*60*1000)); // Last 24h

    return hasChange ? "changed" : "ok";
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#3D3428] font-sans">
      {/* Header */}
      <header className="bg-[#3D3428] text-white py-10 px-6 text-center relative overflow-hidden">
        <div className="inline-block text-[0.72rem] tracking-widest text-[#A0845C] border border-[#A0845C] px-3 py-1 rounded-sm mb-3">
          SUPPLIER CATALOG MONITOR
        </div>
        <h1 className="text-3xl font-serif font-bold mb-2 tracking-tight">メーカーカタログ監視システム</h1>
        <p className="text-[#E8E0D0] text-sm opacity-80">サイト更新を早期検知し、製品仕様の変動を見逃しません</p>
      </header>

      {/* Toolbar */}
      <div className="bg-[#5C4E3C] px-6 py-3 flex flex-wrap gap-2 items-center justify-end">
        <div className="mr-auto text-xs text-[#EAD9C4] opacity-80 flex items-center gap-1">
          {lastCheckTime ? `最終確認: ${lastCheckTime}` : "監視未実施"}
        </div>
        <button 
          onClick={startMonitoring}
          disabled={isMonitoring}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#5C7A5C] hover:bg-[#3E5A3E] text-white text-xs font-bold rounded shadow-sm disabled:opacity-50 transition-colors"
        >
          {isMonitoring ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
          監視スタート
        </button>
        <button 
          onClick={() => setShowHistory(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#A0845C] hover:opacity-90 text-white text-xs font-bold rounded shadow-sm transition-colors"
        >
          <History className="w-3.5 h-3.5" />
          監視履歴
        </button>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#E8E0D0] hover:opacity-90 text-[#3D3428] text-xs font-bold rounded shadow-sm transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          メーカー追加
        </button>
      </div>

      <div className="h-1 bg-gradient-to-r from-[#3E5A3E] via-[#A0845C] to-[#3E5A3E]" />

      {/* Filter Bar */}
      <nav className="sticky top-0 z-40 bg-[#3D3428] border-b border-white/10 px-6 py-2 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-2">
          {kanaList.map(kana => (
            <button
              key={kana}
              onClick={() => setActiveKana(kana)}
              className={`whitespace-nowrap px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeKana === kana ? "bg-[#5C7A5C] text-white" : "text-[#E8E0D0] hover:bg-white/10"
              }`}
            >
              {kana}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Count Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[#D4CBBA]" />
          <span className="text-xs text-[#7A6E60] tracking-wider uppercase">
            {activeKana} • {filteredSuppliers.length} 件
          </span>
          <div className="flex-1 h-px bg-[#D4CBBA]" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSuppliers.map(supplier => {
            const status = getStatus(supplier);
            return (
              <motion.div
                layout
                key={supplier.id}
                className="group bg-[#FDFAF5] border border-[#D4CBBA] hover:border-[#D4E4D4] rounded-lg p-5 flex flex-col shadow-sm transition-all relative overflow-hidden"
              >
                {/* Status Indicator */}
                <div className={`absolute top-0 left-0 right-0 h-1 transition-opacity ${
                  status === "changed" ? "bg-red-500" : status === "ok" ? "bg-[#5C7A5C]" : "bg-yellow-400"
                }`} />

                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-serif font-bold text-lg leading-tight">{supplier.name}</h3>
                  <div className="flex flex-col items-end gap-1">
                    <span className="w-7 h-7 flex items-center justify-center bg-[#5C7A5C] text-white rounded-full text-[0.7rem] font-bold">
                      {supplier.kana}
                    </span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/50 border border-[#D4CBBA] text-[0.6rem] font-bold">
                      {status === "changed" ? (
                        <span className="text-red-600 flex items-center gap-0.5">🔴 変更あり</span>
                      ) : status === "ok" ? (
                        <span className="text-[#5C7A5C] flex items-center gap-0.5">🟢 正常</span>
                      ) : (
                        <span className="text-yellow-600 flex items-center gap-0.5">🟡 未確認</span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[#7A6E60] text-sm leading-relaxed border-l-2 border-[#EAD9C4] pl-3 mb-6 flex-1">
                  {supplier.desc}
                </p>

                <div className="space-y-2 mb-4">
                  {supplier.links.map((link, idx) => {
                    const mon = monitoringResults[link.url];
                    return (
                      <div key={idx} className="group/link flex flex-col gap-1">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-between px-3 py-2 rounded text-xs font-bold transition-all ${
                            link.primary 
                              ? "bg-[#5C7A5C] text-white hover:bg-[#3E5A3E]" 
                              : "border border-[#D4CBBA] text-[#3D3428] hover:bg-[#E8E0D0]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {link.label}
                            <ExternalLink className="w-3 h-3 opacity-50" />
                          </span>
                        </a>
                        {mon && (
                          <div className="px-2 text-[0.65rem] text-[#7A6E60] flex justify-between">
                            <span>最終確認: {new Date(mon.checkedAt).toLocaleDateString()}</span>
                            <span>{mon.contentLength ? `${(parseInt(mon.contentLength)/1024).toFixed(0)}KB` : "サイズ不明"}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 pt-4 border-t border-[#D4CBBA]">
                  <button 
                    onClick={() => handleOpenEdit(supplier)}
                    className="flex-1 py-2 rounded bg-[#EAD9C4]/40 text-[#A0845C] border border-[#EAD9C4] hover:bg-[#A0845C] hover:text-white text-xs font-bold transition-all"
                  >
                    編集
                  </button>
                  <button 
                    onClick={() => deleteSupplier(supplier.id)}
                    className="p-2 rounded bg-red-50 text-red-400 border border-red-100 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <footer className="bg-[#3D3428] text-[#E8E0D0] py-10 px-6 text-center text-xs opacity-60">
        © メーカーカタログ監視システム - Agriculture Design
      </footer>

      {/* --- History Drawer --- */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#FDFAF5] z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-[#D4CBBA] flex justify-between items-center bg-[#3D3428] text-white">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-[#A0845C]" />
                  <h2 className="font-serif font-bold text-lg">監視履歴</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={exportHistory} className="p-2 hover:bg-white/10 rounded-full text-[#EAD9C4]">
                    <Download className="w-4 h-4" />
                  </button>
                  <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-white/10 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {history.length === 0 ? (
                  <div className="text-center py-20 text-[#7A6E60]">
                    <Search className="w-10 h-10 mx-auto mb-4 opacity-20" />
                    <p>履歴はありません</p>
                  </div>
                ) : (
                  history.map(item => (
                    <div key={item.id} className={`p-4 rounded-lg border flex flex-col gap-2 ${
                      item.type === "changed" ? "bg-red-50 border-red-100" : item.type === "error" ? "bg-orange-50 border-orange-100" : "bg-white border-[#D4CBBA]"
                    }`}>
                      <div className="flex justify-between items-start">
                        <span className={`text-[0.65rem] px-2 py-0.5 rounded-full font-bold ${
                          item.type === "changed" ? "bg-red-500 text-white" : item.type === "error" ? "bg-orange-500 text-white" : "bg-[#5C7A5C] text-white"
                        }`}>
                          {item.type === "changed" ? "変更検出" : item.type === "error" ? "エラー" : "正常"}
                        </span>
                        <span className="text-[0.65rem] text-[#7A6E60]">{item.timestamp}</span>
                      </div>
                      <h4 className="font-bold text-sm">{item.supplierName}</h4>
                      <p className="text-xs text-[#7A6E60] break-all">{item.url}</p>
                      {item.prevValue && (
                        <div className="flex items-center gap-2 text-[0.65rem] mt-1 bg-white/50 p-2 rounded border border-black/5">
                          <span className="line-through text-red-400">{item.prevValue}</span>
                          <ChevronRight className="w-3 h-3" />
                          <span className="font-bold text-[#5C7A5C]">{item.newValue}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Modal --- */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(null)}
              className="absolute inset-0 bg-black/40"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#FDFAF5] w-full max-w-xl rounded-xl shadow-2xl p-8 z-10 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="font-serif font-bold text-xl mb-6 pb-4 border-b border-[#D4CBBA]">
                {showModal === "add" ? "メーカー追加" : "メーカー編集"}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5C4E3C] mb-1">会社名 <span className="text-red-500">*</span></label>
                  <input 
                    value={formName} onChange={e => setFormName(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#D4CBBA] p-2 rounded focus:ring-1 focus:ring-[#5C7A5C] focus:border-[#5C7A5C] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C4E3C] mb-1">頭文字 <span className="text-red-500">*</span></label>
                  <input 
                    value={formKana} onChange={e => setFormKana(e.target.value)} maxLength={1}
                    className="w-20 bg-[#F5F0E8] border border-[#D4CBBA] p-2 rounded text-center outline-none" placeholder="あ"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C4E3C] mb-1">主な製品・説明</label>
                  <textarea 
                    value={formDesc} onChange={e => setFormDesc(e.target.value)}
                    className="w-full bg-[#F5F0E8] border border-[#D4CBBA] p-2 rounded min-h-[80px] outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-[#5C4E3C] mb-2">リンク設定</label>
                  <div className="space-y-3">
                    {formLinks.map((link, idx) => (
                      <div key={idx} className="bg-[#F5F0E8] border border-[#D4CBBA] p-4 rounded-lg relative">
                        <button 
                          onClick={() => setFormLinks(formLinks.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="grid gap-2">
                          <input 
                            placeholder="ラベル" value={link.label}
                            onChange={e => {
                              const next = [...formLinks];
                              next[idx].label = e.target.value;
                              setFormLinks(next);
                            }}
                            className="bg-white border border-[#D4CBBA] p-2 rounded text-xs outline-none"
                          />
                          <input 
                            placeholder="URL (https://...)" value={link.url}
                            onChange={e => {
                              const next = [...formLinks];
                              next[idx].url = e.target.value;
                              setFormLinks(next);
                            }}
                            className="bg-white border border-[#D4CBBA] p-2 rounded text-xs outline-none"
                          />
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => setFormLinks([...formLinks, { label: "新リンク", url: "", primary: false }])}
                      className="w-full py-2 border-2 border-dashed border-[#D4CBBA] rounded text-xs font-bold text-[#7A6E60] hover:bg-[#EAD9C4]/20 transition-all"
                    >
                      + リンクを追加
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#D4CBBA] flex justify-end gap-3">
                <button onClick={() => setShowModal(null)} className="px-6 py-2 rounded border border-[#D4CBBA] text-sm font-bold">キャンセル</button>
                <button onClick={saveSupplier} className="px-8 py-2 rounded bg-[#5C7A5C] text-white text-sm font-bold hover:bg-[#3E5A3E] transition-all">保存する</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
