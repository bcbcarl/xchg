import {OrderData} from "./types";

const template = `
<div class="list">
  <table cellspacing="0">
    <caption>交易記錄</caption>
    <thead>
      <tr>
        <th>交易時間</th>
        <th>幣別</th>
        <th>金額</th>
        <th>成本</th>
        <th>匯率</th>
      </tr>
    </thead>
    <tbody v-cloak>
      <tr v-for="order of orders" track-by="when" transition="fade">
        <td class="time">{{order.when}}</td>
        <td class="currency">{{order.code | translate}}</td>
        <td class="foreign" :class="isNegClass(order.foreign)">{{order.foreign | floatFormat 2}}</td>
        <td class="local" :class="isNegClass(order.local)">{{order.local | floatFormat 2}}</td>
        <td class="rate">{{-(order.local/order.foreign) | floatFormat 4}}</td>
      </tr>
    </tbody>
  </table>
</div>
`;

Vue.component("order-list", {
    template: template,
    props: ["orders"],
    methods: {
	isNegClass: (val:number):string => {
	    if (val < 0) {
		return 'negative';
	    }
	}
    }
});