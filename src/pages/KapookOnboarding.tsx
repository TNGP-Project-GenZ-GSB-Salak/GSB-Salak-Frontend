import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { PageHeader } from "../components/PageHeader";
import { Button } from "../components/Button";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useKapook } from "../context/KapookContext";
import type { KycInfo } from "../lib/kapookTypes";

type Step = "idcard" | "review" | "terms" | "success";

// Static mock personal-info profile the "ID lookup" auto-fills — transcribed
// from the prototype's own demo data. There is no real KYC backend (see
// docs/GAPS.md — internal/kapook doesn't exist), so this is fixed content,
// not derived from the typed ID number.
const MOCK_PROFILE = {
  fullNameTh: "นาย ออมจัง ออมดี",
  fullNameEn: "Mr. Aomjung Aomdee",
  birthDateBE: "12 พ.ค. 2535",
  address: "xx/xx หมู่ที่ x ถนน xxxx แขวง xxxx เขต xxxx กรุงเทพฯ xxxxx",
  occupation: "พนักงานบริษัทเอกชน",
  workplace: "3 อาคารรัฐมนตรี ชั้น 24 ถนนสาทรใต้ แขวงยานนาวา เขตสาทร กรุงเทพฯ 10120",
};

function formatIdNumber(digits: string): string {
  const groups = [digits.slice(0, 4), digits.slice(4, 5), digits.slice(5, 10), digits.slice(10, 12)];
  return groups.filter(Boolean).join("-");
}

// Matches the prototype's real onboarding flow (extracted by driving
// designs/…V.4.html directly): piggySuggest doesn't exist as a separate
// screen — "ออมก่อน" goes straight to an ID-card-number entry screen, whose
// "ถัดไป" jumps to a review screen with mock auto-filled personal info (no
// manual form), gated by a native-style confirm dialog, then a full-page
// T&C screen (not a bottom sheet), then success.
export function KapookOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const requestedProductId = (location.state as { productId?: string } | null)?.productId;
  const { openAccount } = useKapook();
  const [step, setStep] = useState<Step>("idcard");
  const [idNumber, setIdNumber] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleConfirmReview() {
    setDialogOpen(true);
  }

  function handleDialogConfirm() {
    setDialogOpen(false);
    setStep("terms");
  }

  function handleAcceptTerms() {
    const kyc: KycInfo = { idNumber, ...MOCK_PROFILE };
    openAccount(kyc);
    setStep("success");
  }

  return (
    <AppShell showNav={false}>
      {step === "idcard" && <PageHeader title="เปิดบัญชีกระปุกออม" variant="back" onAction={() => navigate("/salak/buy")} />}
      {step === "review" && <PageHeader title="เปิดบัญชีกระปุกออม" variant="back" onAction={() => setStep("idcard")} />}
      {step === "terms" && (
        <header className="page-header kyc-header-both">
          <button type="button" onClick={() => setStep("review")} className="page-header__button" aria-label="ย้อนกลับ">
            <BackIcon className="h-[22px] w-[22px]" />
          </button>
          <h1 className="page-header__title" style={{ fontSize: 17 }}>
            ข้อกำหนดและเงื่อนไข
          </h1>
          <button type="button" onClick={() => navigate("/salak/buy")} className="page-header__button" aria-label="ปิด">
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>
      )}
      {step === "success" && <PageHeader title="เปิดบัญชีกระปุกออม" variant="plain" />}

      {step === "idcard" && (
        <div className="flex flex-1 flex-col items-center px-6 pb-6 pt-2">
          <div className="kyc-art">
            <span className="kyc-circle" style={{ width: 190, height: 190, background: "var(--mymo-pastel-pink)", opacity: 0.55 }} />
            <span className="kyc-circle" style={{ top: 6, left: 24, width: 58, height: 58, background: "var(--mymo-pink-landing)", opacity: 0.85 }} />
            <span className="kyc-circle" style={{ top: 0, right: 34, width: 46, height: 46, background: "var(--mymo-pink)" }} />
            <span className="kyc-circle" style={{ bottom: 52, left: 44, width: 22, height: 22, background: "var(--mymo-pink-landing)" }} />
            <div className="kyc-idcard">
              <span className="kyc-idcard__chip" />
              <span className="kyc-idcard__number">ABO-1234567-89</span>
            </div>
          </div>

          <p className="kyc-caption">กรุณากรอกเลขหลังบัตรประชาชน</p>

          <div className="kyc-input-card">
            <input
              inputMode="text"
              placeholder="0000-0-00000-00"
              value={formatIdNumber(idNumber)}
              onChange={(e) => setIdNumber(e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 12))}
              className="kyc-input"
              data-testid="kyc-id-input"
            />
          </div>
          <p className="kyc-helper">เลขชุด 12 หลักที่อยู่ด้านหลังบัตรประชาชนของคุณ ใช้เพื่อยืนยันตัวตนในการเปิดบัญชีกระปุกออมสลาก</p>

          <div className="flex-1" />
          <div className="kyc-next-row w-full">
            <button
              type="button"
              disabled={idNumber.length < 12}
              onClick={() => setStep("review")}
              className="kyc-next-button"
              data-testid="kyc-next"
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="flex flex-col px-5 pb-3">
          <div className="kyc-art kyc-art--sm">
            <span className="kyc-circle" style={{ width: 160, height: 160, background: "var(--mymo-pastel-pink)", opacity: 0.6 }} />
            <span className="kyc-circle" style={{ top: 6, left: 44, width: 54, height: 54, background: "var(--mymo-pink-landing)", opacity: 0.9 }} />
            <span className="kyc-circle" style={{ top: 44, right: 48, width: 42, height: 42, background: "var(--mymo-pink)" }} />
            <div className="kyc-doc">
              <span className="kyc-doc__tab" />
              <span className="kyc-doc__line" />
              <span className="kyc-doc__line" />
              <span className="kyc-doc__line" />
              <span className="kyc-doc__line" style={{ width: "70%" }} />
            </div>
          </div>

          <p className="kyc-caption mb-5" style={{ marginTop: 10 }}>
            ตรวจสอบข้อมูลเปิดบัญชีกระปุกออม
          </p>

          <div className="kyc-review-card">
            <Field label="ชื่อ - นามสกุล (ไทย)" value={MOCK_PROFILE.fullNameTh} />
            <Field label="ชื่อ - นามสกุล (อังกฤษ)" value={MOCK_PROFILE.fullNameEn} />
            <div className="kyc-field-grid">
              <Field label="วัน/เดือน/ปีเกิด (พ.ศ.)" value={MOCK_PROFILE.birthDateBE} />
              <Field label="หมายเลขบัตรประชาชน" value={idNumber} />
            </div>
            <Field label="ที่อยู่ตามทะเบียนบ้าน" value={MOCK_PROFILE.address} />
            <Field label="อาชีพ" value={MOCK_PROFILE.occupation} />
            <Field label="สถานที่ทำงาน" value={MOCK_PROFILE.workplace} />
          </div>

          <div className="mt-4">
            <Button onClick={handleConfirmReview} data-testid="kyc-confirm-button">
              ยืนยัน
            </Button>
          </div>
        </div>
      )}

      {step === "terms" && (
        <div className="flex flex-col gap-1 p-5 pb-24">
          <p className="terms-page__clause">
            1) ผู้ใช้บริการรับทราบว่า บัญชีกระปุกออมดิจิทัล (บัญชีกระปุกออม : MyPiggy บน MyMo) ("กระปุกออม")
            เป็นการจัดเก็บเงินออมในรูปแบบดิจิทัลบนบริการ MyMo โดยผู้ใช้บริการสามารถทำรายการฝาก ถอน
            ตรวจสอบข้อมูลรายการกระปุกออมของผู้ใช้บริการ ผ่านบริการ MyMo หรือช่องทางอื่นใดตามที่ธนาคารกำหนด
          </p>
          <p className="terms-page__clause">
            2) ผู้ใช้บริการสามารถเปิดบัญชีกระปุกออมได้ 1 ท่าน ต่อ 1 บัญชีเท่านั้น ไม่ว่าจะเป็นการเปิดผ่านบริการ MyMo
            ธนาคารออมสินสาขา หรือช่องทางอื่นใดที่ธนาคารกำหนด โดยผู้ใช้บริการจะต้องมีบัญชีเงินฝากประเภทเผื่อเรียกของธนาคารออมสินสาขาใดก็ได้ที่เป็นชื่อของตนเองเป็นบัญชีคู่โอนสำหรับโอนเงินเมื่อมีการถอนเงินออกจากกระปุกออม
            รวมทั้งดอกเบี้ย (ถ้ามี)
          </p>
          <p className="terms-page__clause">
            3) เงินที่เก็บสะสมในกระปุกออมสิน (กระปุกเงินฝาก) จะยังคงได้รับอัตราดอกเบี้ยตามเงื่อนไขบัญชีเงินฝากออมทรัพย์ปกติ
            และผู้ฝากสามารถถอนเงินออมได้โดยไม่มีค่าธรรมเนียมจำนวนไม่เกิน 2 ครั้งต่อปี
            หากถอนเกินกว่าจำนวนครั้งที่กำหนด ธนาคารจะคิดค่าธรรมเนียมในอัตราร้อยละ 2 ของยอดเงินที่ถอน
          </p>
          <p className="terms-page__clause">4) ในกรณีที่ผู้ฝากไม่สามารถออมเงินได้ครบตามจำนวนหรือเงื่อนไขที่กำหนดไว้ จะไม่มีการหักค่าธรรมเนียมหรือค่าปรับใดๆ ทั้งสิ้น</p>

          <div className="fixed inset-x-0 bottom-0 p-5">
            <Button onClick={handleAcceptTerms} data-testid="accept-terms">
              ถัดไป
            </Button>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center px-6 pt-6">
          <div className="kyc-art">
            <span className="kyc-circle" style={{ width: 180, height: 180, background: "var(--mymo-pastel-pink)", opacity: 0.6 }} />
            <span className="kyc-circle" style={{ top: 8, right: 64, width: 52, height: 52, background: "var(--mymo-pink-landing)" }} />
            <span className="kyc-circle" style={{ bottom: 44, left: 60, width: 46, height: 46, background: "var(--mymo-pink-landing)", opacity: 0.9 }} />
            <span className="kyc-circle" style={{ bottom: 58, right: 52, width: 20, height: 20, background: "var(--mymo-pink)" }} />
            <div className="kyc-success-check">
              <CheckIcon className="h-[54px] w-[54px]" />
            </div>
          </div>
          <p className="font-semibold" style={{ fontSize: 15 }}>
            เปิดบัญชีกระปุกออมสำเร็จ
          </p>
          <div className="mt-4 w-full">
            <Button
              onClick={() => navigate("/kapook/goal/new", { state: { productId: requestedProductId } })}
              data-testid="go-to-goal-setup"
            >
              เสร็จสิ้น
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={dialogOpen}
        message="กรุณาตรวจสอบและยืนยันข้อมูลการเปิดบัญชีกระปุกออม หากต้องการเปลี่ยนแปลงข้อมูล กรุณาติดต่อสาขาธนาคารออมสิน"
        confirmLabel="ยืนยันข้อมูลถูกต้อง"
        cancelLabel="ยกเลิก"
        onConfirm={handleDialogConfirm}
        onCancel={() => setDialogOpen(false)}
      />
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="kyc-field__label">{label}</p>
      <p className="kyc-field__value">{value || "-"}</p>
    </div>
  );
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="m15 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon(props: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} {...props}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
