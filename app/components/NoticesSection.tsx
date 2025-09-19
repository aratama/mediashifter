"use client";

export default function NoticesSection() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 className="font-semibold text-yellow-800 mb-2">注意事項</h3>
      <ul className="text-sm text-yellow-700 space-y-1">
        <li>• 大きなファイルの変換には時間がかかる場合があります</li>
      </ul>
    </div>
  );
}
