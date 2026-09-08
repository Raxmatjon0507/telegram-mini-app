import { useState } from "react";
import { api } from "../api";

export default function FloatingButton() {
  const [open, setOpen] = useState(false);
  const [showComplaint, setShowComplaint] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendComplaint = async () => {
    if (!complaintText.trim()) return;
    setSending(true);
    try {
      await api("POST", "/api/complaints", { text: complaintText });
      setSent(true);
      setComplaintText("");
      setTimeout(() => {
        setShowComplaint(false);
        setSent(false);
      }, 2000);
    } catch (e) {
      alert("Xatolik yuz berdi");
    }
    setSending(false);
  };

  return (
    <>
      <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-3">
        {open && (
          <>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-gray-700 shadow-lg rounded-full w-12 h-12 flex items-center justify-center text-xl hover:scale-110 transition-transform"
              title="Admin bilan bog'lanish"
            >
              💬
            </a>
            <button
              onClick={() => {
                setShowComplaint(true);
                setOpen(false);
              }}
              className="bg-white dark:bg-gray-700 shadow-lg rounded-full w-12 h-12 flex items-center justify-center text-xl hover:scale-110 transition-transform"
              title="Shikoyat yuborish"
            >
              📝
            </button>
          </>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 text-white shadow-lg rounded-full w-14 h-14 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {showComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Shikoyat yuborish</h3>
            {sent ? (
              <div className="text-center py-4 text-green-600 font-semibold">
                Yuborildi! ✓
              </div>
            ) : (
              <>
                <textarea
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 h-32 resize-none bg-gray-50 dark:bg-gray-700"
                  placeholder="Shikoyatingizni yozing..."
                />
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setShowComplaint(false)}
                    className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-600"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleSendComplaint}
                    disabled={sending}
                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                  >
                    {sending ? "Yuborilmoqda..." : "Yuborish"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
