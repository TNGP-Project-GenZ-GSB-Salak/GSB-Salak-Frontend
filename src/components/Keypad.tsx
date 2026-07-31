const KEY_DEFS = [
  { key: "1", sub: "" },
  { key: "2", sub: "ABC" },
  { key: "3", sub: "DEF" },
  { key: "4", sub: "GHI" },
  { key: "5", sub: "JKL" },
  { key: "6", sub: "MNO" },
  { key: "7", sub: "PQRS" },
  { key: "8", sub: "TUV" },
  { key: "9", sub: "WXYZ" },
  { key: "", sub: "" },
  { key: "0", sub: "" },
  { key: "del", sub: "" },
] as const;

interface KeypadProps {
  title: string;
  subText?: string;
  footerText?: string;
  display: string;
  onDigit: (digit: string) => void;
  onDelete: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

// The prototype's numeric keypad sheet: title/cancel/confirm row, a
// right-aligned running total, and a 3-column T9-style grid (with the
// bottom-left cell left blank, matching a real phone keypad).
export function Keypad({
  title,
  subText,
  footerText,
  display,
  onDigit,
  onDelete,
  onCancel,
  onConfirm,
}: KeypadProps) {
  return (
    <div data-testid="keypad">
      <div className="keypad__header">
        <button type="button" onClick={onCancel} className="keypad__header-action">
          ยกเลิก
        </button>
        <span className="keypad__title">{title}</span>
        <button type="button" onClick={onConfirm} data-testid="keypad-confirm" className="keypad__header-action keypad__header-action--strong">
          เสร็จสิ้น
        </button>
      </div>
      {subText && <div className="keypad__subtext">{subText}</div>}
      <div className="keypad__display" data-testid="keypad-display">
        {display}
      </div>
      {footerText && <div className="keypad__footer">{footerText}</div>}
      <div className="keypad__grid">
        {KEY_DEFS.map((def, index) => (
          <button
            key={index}
            type="button"
            disabled={def.key === ""}
            data-testid={def.key ? `keypad-key-${def.key}` : undefined}
            onClick={def.key === "" ? undefined : def.key === "del" ? onDelete : () => onDigit(def.key)}
            className="keypad__key"
          >
            <span className="keypad__key-label">{def.key === "del" ? "⌫" : def.key}</span>
            {def.sub && <span className="keypad__key-sub">{def.sub}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
