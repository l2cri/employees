<template>
  <v-app>
    <v-main class="container align-center px-1">
      <h2 class="font-weight-light mb-2">
        Список сотрудников
      </h2>
      <v-card>
        <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            :loading="loading"
            :server-items-length="totalCount"
            :options.sync="options"
            mobile-breakpoint="800"
            class="elevation-0">
          <template v-slot:top>
            <v-text-field
                v-model="search"
                label="Поиск по имени или должности"
                class="mx-4"
            />
          </template>
          <template v-slot:item.actions="{ item }">
            <div class="text-truncate">
              <v-icon
                  small
                  class="mr-2"
                  @click="showEditDialog(item)"
                  color="primary"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                  small
                  @click="deleteItem(item)"
                  color="pink"
              >
                mdi-delete
              </v-icon>
            </div>
          </template>
        </v-data-table>
        <!-- this dialog is used for both create and update -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <div class="d-flex">
              <v-btn color="primary" dark class="ml-auto ma-3" v-on="on">
                Добавить
                <v-icon small>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </div>
          </template>
          <v-card>
            <v-card-title>
              <span v-if="editedItem.id">Изменить {{editedItem.id}}</span>
              <span v-else>Создать</span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field
                      ref="name"
                      v-model="editedItem.name"
                      :rules="[rules.required]"
                      label="ФИО"
                      @keypress="isNotNumber($event)"
                  />
                </v-col>
                <v-col cols="12" sm="12">
                  <v-menu
                      v-model="menuBirthday"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                          ref="birthday"
                          v-model="editedItem.birthday"
                          label="Дата рождения"
                          :rules="[rules.required]"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                      />
                    </template>
                    <v-date-picker
                        v-model="editedItem.birthday"
                        @input="menuBirthday = false"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                      ref="position"
                      v-model="editedItem.position"
                      label="Должность"
                      @keypress="isNotNumber($event)"
                      :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                      ref="salary"
                      v-model.number="editedItem.salary"
                      label="Оклад"
                      :rules="[rules.required]"
                      @keypress="isNumber($event)"
                  />
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="showEditDialog()">Отмена</v-btn>
              <v-btn color="blue darken-1" text @click="saveItem(editedItem)">Сохранить</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
      headers: [
        { text: 'ФИО', value: 'name' },
        { text: 'Дата рождения', value: 'birthday'},
        { text: 'Должность', value: 'position' },
        { text: 'Оклад', value: 'salary' },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      options: {},
      loading: false,
      dialog: false,
      search: '',
      menuBirthday: false,
      rules: {
        required: value => !!value || 'Пожалуйста, заполните поле.',
      },
      editedItem: {}
    }
  },
  methods: {
    showEditDialog(item) {
      this.editedItem = { ...item } || {}
      this.dialog = !this.dialog
    },
    validateForm() {
      let formValid = true;

      this.headers.forEach(({ value }) => {
        if (!this.editedItem[value] && value !== 'actions') {
          formValid = false
        }

        if (this.$refs && this.$refs[value]) {
          this.$refs[value].validate(true)
        }
      })


      return formValid
    },
    saveItem(item) {
      if (!this.validateForm()) {
        return false
      }

     if(item.id) {
       this.$store.dispatch('employees/update', item)
     } else {
       this.$store.dispatch('employees/add', item)
     }
      this.dialog = false
      this.editedItem = {}
    },
    deleteItem(item) {
      if (confirm('Are you sure you want to delete this?')) {
        this.$store.dispatch('employees/delete', item.id)
      }
    },
    isNumber(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode;
      if (
          charCode > 31 &&
          (charCode < 48 || charCode > 57) &&
          charCode !== 46
      ) {
        evt.preventDefault();
      }
    },
    isNotNumber(evt) {
      const charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode >= 48 && charCode <= 57) {
        evt.preventDefault();
      }
    }
  },
  computed: {
    items() {
      return this.$store.state.employees.items
    },
    totalCount() {
      if (this.options.itemsPerPage === -1) {
        return -1
      }
      return this.$store.state.employees.paginate.totalDocs
    },
    optionsPage() {
      const optionsPage = {
        page: this.options.page,
        limit: this.options.itemsPerPage,
      }
      if (this.options.sortBy && this.options.sortBy.length) {
        const suffix =  this.options.sortDesc[0] === false ? '-' : ''
        optionsPage['sort'] = suffix  + this.options.sortBy[0]
      }

      return optionsPage
    }
  },
  watch: {
    options: {
      async handler() {
        const optionsPage = this.optionsPage
        if (this.search && this.search.length) {
          optionsPage['query'] = this.search.trim()
        }
        this.loading = true
        await this.$store.dispatch('employees/load', optionsPage)
        this.loading = false

      },
      deep: true,
    },
    search(query) {
      this.loading = true
      clearTimeout(this._searchTimerId)
      this._searchTimerId = setTimeout(async () => {
        this.options.page = 1
        await this.$store.dispatch('employees/load', { ...this.optionsPage, query: query.trim()})
        this.loading = false
      }, 500)
    }
  },
}
</script>
