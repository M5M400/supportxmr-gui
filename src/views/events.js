import { formatFiat } from "../calc.js";
import { formatXmr, isFiniteNumber } from "../format.js";
import { dismissMotd } from "../motd.js";
import { appendWallet, rmWallet, loadWatchlist, localHistoryEnabled, setConsent } from "../privacy.js";
import { state } from "../state.js";
import { trackWalletState } from "../wallet.js";
import { blockRoute } from "./blocks.js";
import { calcRoute, calcRowsForDisplay } from "./calc.js";
import { bindChartHover } from "./charts.js";
import { bindSettingsForms, walletPaymentRoute } from "./wallet.js";
import { paymentRoute } from "./payments.js";
import { bindSetupEvents } from "./setup.js";
import { bindHomeDeferred, bindHomeUptime, syncWalletTrackButtonLabels } from "./home.js";
import { attr, on, byId, qs, qsa } from "../dom.js";

export function bindViewEvents() {
  on(qs("#ai"), "input", (event) => event.currentTarget.setCustomValidity(""));
  on(qs("#af"), "submit", (event) => {
    event.preventDefault();
    const address = qs("#ai").value.trim();
    const tracked = trackWalletState(state.w, address);
    if (tracked.nextHash) {
      state.w = appendWallet(address);
      location.hash = tracked.nextHash;
    }
    else qs("#ai").setCustomValidity("Enter a complete XMR address");
  });
  qsa("[data-remove-wallet]").forEach((button) => on(button, "click", () => {
    const address = button.dataset.removeWallet;
    state.w = rmWallet(address);
    byId(`wallet-${address}`)?.remove();
    if (!state.w.length) {
      const walletList = byId("wallet-list");
      if (walletList) walletList.innerHTML = `<div class="card muted">No wallets tracked yet.</div>`;
      qs(".graph-switches")?.closest(".card")?.remove();
    }
    if (state.r.n === "wallet" && state.r.a === address) location.hash = "#/";
  }));
  bindBlockControls();
  bindPaymentControls();
  bindWalletPaymentControls();
  bindSettingsForms();
  bindCopyButtons();
  bindMotdDismiss();
  bindCalcEvents();
  bindLocalHistoryControls();
  bindSetupEvents();
  bindHomeUptime();
  bindHomeDeferred();
  bindChartHover();
}

function bindBlockControls() {
  on(qs("#blocks-coin-filter"), "change", (event) => {
    location.hash = blockRoute(event.target.value, 1, pageSize("#bps"));
  });
  bindPagedRoute("#bps", "#bpi", (page, size) => blockRoute(selectedValue("#blocks-coin-filter"), page, size));
}

function bindPaymentControls() {
  bindPagedRoute("#pps", "#ppi", paymentRoute);
}

function bindWalletPaymentControls() {
  bindWalletPager("ww", "withdrawalPage", "withdrawalLimit");
  bindWalletPager("wr", "blockRewardPage", "blockRewardLimit");
}

function bindPagedRoute(sizeSelector, inputSelector, routeFor) {
  on(qs(sizeSelector), "change", (event) => {
    location.hash = routeFor(1, event.target.value);
  });
  bindPageInput(inputSelector, (page) => routeFor(page, pageSize(sizeSelector)));
}

function bindWalletPager(kind, pageKey, limitKey) {
  on(qs(`#${kind}-page-size`), "change", (event) => {
    location.hash = walletPaymentRoute({ [pageKey]: 1, [limitKey]: event.target.value });
  });
  bindPageInput(`#${kind}-page-input`, (page) => walletPaymentRoute({ [pageKey]: page }));
}

function bindCopyButtons() {
  qsa("[data-copy-target]").forEach((button) => on(button, "click", () => {
    const target = qs(button.dataset.copyTarget);
    navigator.clipboard?.writeText(target?.textContent || "");
  }));
}

function bindMotdDismiss() {
  on(qs("[data-dismiss-motd]"), "click", (event) => {
    dismissMotd(event.currentTarget.dataset.dismissMotd, { persist: localHistoryEnabled() });
    event.currentTarget.closest(".motd-card")?.remove();
  });
}

function bindCalcEvents() {
  const hashrate = qs("#ch");
  const unit = qs("#cu");
  const form = qs("#calc-form");
  if (!hashrate || !unit || !form) return;
  on(form, "submit", (event) => event.preventDefault());
  const update = () => {
    const phDay = Number(form.dataset.profitPerHash);
    // An empty data-price means the API gave no price; keep it non-finite (Number("") is 0).
    const price = form.dataset.price === "" ? NaN : Number(form.dataset.price);
    const fiatLabel = form.dataset.fiatLabel || "USD";
    const rows = calcRowsForDisplay(hashrate.value, unit.value, phDay, price, fiatLabel);
    qsa(".xmr-output").forEach((node) => {
      const row = rows.find((item) => String(item.days) === node.dataset.period);
      if (row) node.textContent = formatXmr(row.xmr, 8);
    });
    qsa(".fiat-output").forEach((node) => {
      const row = rows.find((item) => String(item.days) === node.dataset.period);
      if (row) node.textContent = formatFiat(row.fiat, row.fiatLabel);
    });
    history.replaceState(null, "", calcRoute(hashrate.value, unit.value));
  };
  on(hashrate, "input", update);
  on(unit, "change", update);
}

function bindLocalHistoryControls() {
  const button = qs("[data-local-history]");
  if (!button) return;
  const sync = () => {
    const enabled = localHistoryEnabled();
    button.textContent = `${enabled ? "Disable" : "Enable"} local wallet history`;
    attr(button, "aria-pressed", String(enabled));
  };
  sync();
  on(button, "click", () => {
    const enabled = setConsent(!localHistoryEnabled());
    state.w = enabled ? loadWatchlist() : [];
    qs(".local-history-consent")?.remove();
    sync();
    syncWalletTrackButtonLabels();
  });
}

function bindPageInput(selector, routeFor) {
  const input = qs(selector);
  if (!input) return;
  const go = () => {
    const value = Number(input.value);
    const max = input.hasAttribute("max") ? Number(input.max) || 1 : Infinity;
    if (!isFiniteNumber(value) || value < 1) return;
    const page = Math.max(1, Math.floor(value));
    location.hash = routeFor(isFiniteNumber(max) ? Math.min(max, page) : page);
  };
  on(input, "change", go);
  on(input, "keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      go();
    }
  });
}

function selectedValue(selector, fallback = "") {
  return qs(selector)?.value || fallback;
}

function pageSize(selector) {
  return selectedValue(selector, "15");
}
