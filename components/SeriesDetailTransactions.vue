<script lang="ts" setup>
import { withToggle } from "@/functions/toggle";
import { Transaction } from "@/types";

interface SeriesDetailTransactionsProps {
  transactions: Transaction[];
  name: string;
}

const props = defineProps<SeriesDetailTransactionsProps>();

const { transactions, name } = toRefs(props);

const transactionsWithToggle = withToggle<Transaction>(transactions);

const findMyShareInTransaction = (name: string) => (t: Transaction) =>
  t.promises.filter((p) => p.name === name).at(0)?.amount ?? 0;
</script>

<template>
  <h2 class="text-xl font-medium mb-4">Transactions</h2>
  <ul>
    <li v-for="transaction in transactionsWithToggle">
      <button class="block w-full my-6" @click="transaction.toggle(true)">
        <ul class="flex justify-between">
          <li class="flex flex-col">
            <span class="text-left">{{ transaction.title }}</span>
            <span class="text-left font-light text-neutral-500 text-sm">{{
              $d(transaction.date)
            }}</span>
          </li>

          <li class="flex flex-col">
            <span class="text-right">{{
              $n(findMyShareInTransaction(name)(transaction))
            }}</span>
            <span class="font-light text-neutral-500 text-sm text-right">{{
              $n(transaction.price)
            }}</span>
          </li>
        </ul>
      </button>

      <the-modal
        :visible="transaction.toggled.value"
        @close="transaction.toggle(false)"
      >
        <h1 class="mb-4">
          <span class="block text-lg font-bold">{{ transaction.title }}</span>
          <span class="block text-sm text-neutral-500 font-light">{{
            $d(transaction.date)
          }}</span>
        </h1>

        <div class="mb-4">
          <h2 class="font-medium">Total</h2>
          <p>
            <span class="font-semibold text-xl">{{
              $n(transaction.price)
            }}</span>
          </p>
        </div>

        <div class="mb-4">
          <h2 class="font-medium">Promises</h2>
          <table class="table-auto w-full mt-2">
            <tbody>
              <tr
                v-for="promise in transaction.promises"
                class="text-neutral-300 border-t border-b border-neutral-200"
                :class="{
                  'text-neutral-800': [name, transaction.payer].includes(
                    promise.name
                  ),
                }"
              >
                <td class="py-1.5">
                  {{ promise.name }}
                  <span
                    v-if="promise.name === transaction.payer"
                    class="border border-black py-0.5 px-1 text-xs rounded-sm ml-1"
                    >Payer</span
                  >
                </td>
                <td class="text-right">{{ $n(promise.amount) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="w-full bg-gray-100 rounded-xl p-4 mt-8"
          v-if="transaction.description"
        >
          <p>
            <span>{{ transaction.description }}</span>
          </p>
        </div>
      </the-modal>
    </li>
  </ul>
</template>
