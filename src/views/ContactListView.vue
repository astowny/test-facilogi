<template>
  <div
    class="contact-list rounded-xl flex flex-col items-stretch w-[45rem] m-auto bg-white shadow-2xl p-4"
  >
    <div v-if="isLoading">{{ errorApi ? errorApi : "Chargement..." }}</div>
    <div class="flex flex-col gap-3" v-else>
      <div class="text-xl font-bold pb-4">Liste des contacts</div>

      <form class="flex gap-4" @submit.prevent="goToPage(1)">
        <div class="text-left">
          <label for="firstname">First name</label>
          <input
            v-model="filterFirstName"
            name="firstname"
            id="firstname"
            class="w-full border border-gray-300 rounded h-10"
            type="text"
          />
        </div>
        <div class="text-left">
          <label for="lastname">Last name</label>
          <input
            v-model="filterLastName"
            name="lastname"
            id="lastname"
            class="w-full border border-gray-300 rounded h-10"
            type="text"
          />
        </div>
        <div class="text-left">
          <label for="email">Email</label>
          <input
            v-model="filterEmail"
            name="email"
            id="email"
            class="w-full border border-gray-300 rounded h-10"
            type="text"
          />
        </div>
        <button
          class="filter-btn h-12 px-4 self-end items-center flex rounded text-white"
          @click="goToPage(1)"
        >
          Rechercher
        </button>
      </form>

      <table class="table-auto w-full">
        <thead>
          <tr>
            <th class="flex items-center gap-2" @click="setSortBy('firstname')">
              Firstname
              <ChevronUpIcon v-if="sortOrder == 'asc'" class="w-4 h-4" />
              <ChevronDownIcon v-else class="w-4 h-4" />
            </th>
            <th @click="setSortBy('lastname')">Lastname</th>
            <th @click="setSortBy('email')">Email</th>
            <th @click="setSortBy('contact type')">Contact type</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b" v-for="(contact, i) in contactList" :key="i">
            <td class="">{{ contact.firstname }}</td>
            <td class="">{{ contact.lastname }}</td>
            <td class="">
              <a
                class="flex items-center gap-2"
                :href="`mailto:${contact.email}}`"
              >
                <EnvelopeIcon class="w-4 h-4" />
                {{ contact.email }}</a
              >
            </td>
            <td class="">{{ contact.contact_type.name }}</td>
          </tr>
        </tbody>
      </table>

      <!-- pagination -->
      <div class="flex gap-2 mx-auto mt-2">
        <div
          class="w-8 cursor-pointer flex flex-shrink-0 basis-8 h-8 shadow-md bg-white rounded items-center justify-center border border-orange-500"
          :class="{ disabled: pagination.page == pagination.pages }"
          @click="goToPage(1)"
        >
          <ChevronLeftIcon class="w-4 h-4" />
          <ChevronLeftIcon class="w-4 h-4 -ml-2" />
        </div>
        <div
          class="w-8 flex flex-shrink-0 basis-8 h-8 shadow-md bg-white rounded items-center cursor-pointer justify-center border border-orange-500"
          :class="{ bgGray: pagination.page > 1 }"
          @click="goToPage(pagination.page - 1)"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </div>
        <span class="mt-2">
          {{ 1 < windowPages[0] ? "..." : "" }}
        </span>
        <a
          class="min-w-8 w-fit px-1 flex cursor-pointer flex-shrink-0 h-8 shadow-md bg-white rounded items-center justify-center border border-orange-500"
          :class="{ 'bg-orange-200': pagination.page === numPage }"
          v-for="numPage in windowPages"
          :key="'pagination-' + numPage"
          @click.prevent="goToPage(numPage)"
        >
          {{ numPage }}
        </a>
        <span class="mt-2">
          {{
            pagination.pages > windowPages[windowPages.length - 1] ? "..." : ""
          }}
        </span>

        <div
          class="w-8 cursor-pointer flex flex-shrink-0 basis-8 h-8 shadow-md bg-white rounded items-center justify-center border border-orange-500"
          :class="{ disabled: pagination.page == pagination.pages }"
          @click="goToPage(pagination.page + 1)"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </div>
        <div
          class="w-8 cursor-pointer flex flex-shrink-0 basis-8 h-8 shadow-md bg-white rounded items-center justify-center border border-orange-500"
          :class="{ disabled: pagination.page == pagination.pages }"
          @click="goToPage(pagination.pages)"
        >
          <ChevronRightIcon class="w-4 h-4" />
          <ChevronRightIcon class="w-4 h-4 -ml-2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { createHttpClient } from "@/api/httpClientAxios";
import {
  EnvelopeIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/vue/24/solid";

const errorApi = ref("");
const pagination = ref({ total: 1, pages: 1 });
const contactList = ref([]);
const httpClient = createHttpClient();
const isLoading = ref(true);

const filterFirstName = ref(null);
const filterLastName = ref(null);
const filterEmail = ref(null);

const sortBy = ref("");
const sortOrder = ref("asc");

const setSortBy = (value) => {
  sortBy.value = value;
  if (sortBy.value == value) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  }
};

const headers = ref([]);
const itemsPerPage = ref(null);
const loading = ref(null);
const serverItems = ref([]);
const totalItems = ref(null);

/** filtre frontend en cours
const filteredContactList = computed(() => {
  let filteredList = contactList.value.filter((contact) => {
    // Vérifier si les champs de filtre sont vides
    const isFirstNameEmpty = !filterFirstName.value;
    const isLastNameEmpty = !filterLastName.value;
    const isEmailEmpty = !filterEmail.value;

    // Vérifier si les champs de contact sont vides
    const isContactFirstNameEmpty = !contact.firstname;
    const isContactLastNameEmpty = !contact.lastname;
    const isContactEmailEmpty = !contact.email;

    // Si tous les champs de filtre sont vides, retourner vrai pour inclure tous les contacts
    if (isFirstNameEmpty && isLastNameEmpty && isEmailEmpty) {
      return true;
    }
    // Filtrer par nom, prénom et email
    const isFirstNameMatch =
      !isContactFirstNameEmpty &&
      (isFirstNameEmpty || contact.firstname.includes(filterFirstName.value));
    const isLastNameMatch =
      !isContactLastNameEmpty &&
      (isLastNameEmpty || contact.lastname.includes(filterLastName.value));
    const isEmailMatch =
      !isContactEmailEmpty &&
      (isEmailEmpty || contact.email.includes(filterEmail.value));

    // Retourner vrai si le contact correspond à tous les critères de filtrage
    return isFirstNameMatch && isLastNameMatch && isEmailMatch;
  });
  // Trier la liste filtrée en fonction des critères de tri sélectionnés
  if (sortBy.value === "firstname") {
    filteredList.sort((a, b) => {
      if (sortOrder.value === "asc") {
        return a.firstname ? a.firstname.localeCompare(b.firstname) : -1;
      } else {
        return b.firstname ? b.firstname.localeCompare(a.firstname) : 1;
      }
    });
  } else if (sortBy.value === "lastname") {
    filteredList.sort((a, b) => {
      if (sortOrder.value === "asc") {
        return a.lastname.localeCompare(b.lastname);
      } else {
        return b.lastname.localeCompare(a.lastname);
      }
    });
  } else if (sortBy.value === "email") {
    filteredList.sort((a, b) => {
      if (sortOrder.value === "asc") {
        return a.email.localeCompare(b.email);
      } else {
        return b.email.localeCompare(a.email);
      }
    });
  }
  return conta;
});
 */
function generateConsecutiveNumbersArray(a, b) {
  var array = [];

  for (var i = a; i <= b; i++) {
    array.push(i);
  }

  return array;
}

const windowPages = computed(() => {
  let range = [pagination.value.page - 2, pagination.value.page + 2];

  if (pagination.value.pages < 5) {
    return generateConsecutiveNumbersArray(1, pagination.value.pages);
  }

  if (pagination.value.page < 3) {
    range = [1, 5];
  }
  if (pagination.value.page > pagination.value.pages - 2) {
    range = [pagination.value.page - 4, pagination.value.page];
  }

  return generateConsecutiveNumbersArray(range[0], range[1]);
});

const goToPage = async (numPage) => {
  try {
    let queryString = `/contact/list?page=${numPage}&limit=10`;
    if (filterFirstName.value) {
      queryString += `&firstName=${filterFirstName.value}`;
    }
    if (filterLastName.value) {
      queryString += `&lastName=${filterLastName.value}`;
    }
    if (filterEmail.value) {
      queryString += `&email=${filterEmail.value}`;
    }

    const response = await httpClient.get(queryString);
    if (response.status != 200) return;
    pagination.value = response.data;
    const { items } = response.data._embedded;
    contactList.value = items;
    isLoading.value = false;
  } catch (error) {
    errorApi.value = "Une erreur est survenue";
    console.log("error", error);
  }
};

onMounted(async () => {
  goToPage(1);
});
</script>

<style scoped>
.filter-btn {
  background: linear-gradient(90deg, #ff8c00 0, #f55b23);
}
</style>
