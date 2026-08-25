import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "tnFT-7Thldg2nQypJfD-P";

// 앱(WebView)이 주입한 스크립트가 결제위젯 렌더링을 담당하는데, 기기/네트워크
// 타이밍에 따라 그 스크립트가 DOM 준비 전에 실행되어 조용히 실패하는 경우가 있다.
// 일정 시간 뒤에도 #payment-method가 비어있으면(=위젯이 안 그려짐) 재시도할 수
// 있는 안내를 보여준다. 새로고침하면 앱의 주입 스크립트도 처음부터 다시 실행된다.
const WIDGET_RENDER_CHECK_DELAY_MS = 1500;

function Payment() {
  const [widgetFailed, setWidgetFailed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const paymentMethodEl = document.getElementById("payment-method");
      const isRendered =
        paymentMethodEl && paymentMethodEl.childElementCount > 0;

      if (!isRendered) {
        setWidgetFailed(true);
      }
    }, WIDGET_RENDER_CHECK_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  // const [amount, setAmount] = useState({
  //   currency: "KRW",
  //   value: 50_000,
  // });
  // const [ready, setReady] = useState(false);
  // const [widgets, setWidgets] = useState(null);

  // useEffect(() => {
  //   async function fetchPaymentWidgets() {
  //     // ------  결제위젯 초기화 ------
  //     const tossPayments = await loadTossPayments(clientKey);
  //     // 회원 결제
  //     const widgets = tossPayments.widgets({
  //       customerKey,
  //     });
  //     // 비회원 결제
  //     // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

  //     setWidgets(widgets);
  //   }

  //   fetchPaymentWidgets();
  // }, [clientKey, customerKey]);

  // useEffect(() => {
  //   async function renderPaymentWidgets() {
  //     if (widgets == null) {
  //       return;
  //     }
  //     // ------ 주문의 결제 금액 설정 ------
  //     await widgets.setAmount(amount);

  //     await Promise.all([
  //       // ------  결제 UI 렌더링 ------
  //       widgets.renderPaymentMethods({
  //         selector: "#payment-method",
  //         variantKey: "DEFAULT",
  //       }),
  //       // ------  이용약관 UI 렌더링 ------
  //       widgets.renderAgreement({
  //         selector: "#agreement",
  //         variantKey: "AGREEMENT",
  //       }),
  //     ]);

  //     setReady(true);
  //   }

  //   renderPaymentWidgets();
  // }, []);

  // useEffect(() => {
  //   if (widgets == null) {
  //     return;
  //   }

  //   widgets.setAmount(amount);
  // }, [widgets, amount]);

  if (widgetFailed) {
    return (
      <div className="wrapper">
        <div className="box_section flex-column align-center text-center">
          <p className="title">결제 화면을 불러오지 못했어요</p>
          <p className="description">
            네트워크 상태를 확인하고 다시 시도해주세요.
          </p>
          <button
            className="btn primary w-90"
            style={{ marginTop: 32 }}
            onClick={() => window.location.reload()}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />

        {/* 결제하기 버튼 */}
        <button
          id="payment-button"
          className="btn primary w-90"
          // disabled={!ready}
          // onClick={async () => {
          //   try {
          //     // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
          //     // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
          //     // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
          //     await widgets.requestPayment({
          //       orderId: "357HVTh9I3khf2vfAi7cb",
          //       orderName: "토스 티셔츠 외 2건",
          //       successUrl: window.location.origin + "/success",
          //       failUrl: window.location.origin + "/fail",
          //       customerEmail: "customer123@gmail.com",
          //       customerName: "김토스",
          //       customerMobilePhone: "01012341234",
          //     });
          //   } catch (error) {
          //     // 에러 처리하기
          //     console.error(error);
          //   }
          // }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

export default Payment;
