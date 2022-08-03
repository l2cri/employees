<template>
  <v-app>
    <v-main class="container align-center px-1">
      <h2 class="font-weight-light mb-2">
        Vuetify CRUD Example
      </h2>
      <v-card>
        <v-data-table
            :headers="headers"
            :items="items"
            mobile-breakpoint="800"
            class="elevation-0">
          <template v-slot:item.actioresponsens="{ item }">
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
                New
                <v-icon small>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </div>
          </template>
          <v-card>
            <v-card-title>
              <span v-if="editedItem.id">Edit {{editedItem.id}}</span>
              <span v-else>Create</span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-text-field v-model="editedItem.name" label="ФИО"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field v-model="editedItem.birthday" label="Дата рождения"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field v-model="editedItem.position" label="Должность"></v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field v-model="editedItem.salary" label="Оклад"></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="showEditDialog()">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="saveItem(editedItem)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios';
const apiToken = "keyZIIVNiQPvozEWb"
const airTableApp = "appXJzFFs2zgj4X5C"
const airTableName = "Example"

export default {
  name: 'HelloWorld',
  data () {
    return {
      headers: [
        { text: 'ФИО', value: 'name',  sortable: false },
        { text: 'Дата рождения', value: 'birthday',  sortable: false },
        { text: 'Должность', value: 'position',  sortable: false },
        { text: 'Оклад', value: 'salary',  sortable: false },
        { text: 'Action', value: 'actions', sortable: false },
      ],
      items: [],
      dialog: false,
      editedItem: {}
    }
  },
  mounted() {
    this.loadItems()
  },
  methods: {
    showEditDialog(item) {
      this.editedItem = item||{}
      this.dialog = !this.dialog
    },
    loadItems() {
      this.items = []
      axios.get(`/api/employees`)
          .then((response) => {
            this.items = response.data.map((item)=>{
              return {
                id: item._id,
                ...item
              }
            })
          }).catch((error) => {
        console.log(error)
      })
    },
    saveItem(item) {
      /* this is used for both creating and updating API records
       the default method is POST for creating a new item */

      let method = "post"
      let url = `/api/employees`
      let id = item.id

      // airtable API needs the data to be placed in fields object
      let data = item

      if (id) {
        // if the item has an id, we're updating an existing item
        method = "put"
        url = `/api/employees/${id}`

        // must remove id from the data for airtable patch to work
        delete data.id
      }

      // save the record
      axios[method](url,
          data,
          { headers: {
              "Content-Type": "application/json"
            }
          }).then((response) => {
        if (response.data && response.data.insertedId) {
          console.log(response.data)
          // add new item to state
          this.editedItem.id = response.data.insertedId
          if (!id) {
            // add the new item to items state
            this.items.push(this.editedItem)
          }
          this.editedItem = {}
        }
        this.dialog = !this.dialog
      })
    },
    deleteItem(item) {
      //console.log('deleteItem', item)
      let id = item.id
      let idx = this.items.findIndex(item => item.id===id)
      if (confirm('Are you sure you want to delete this?')) {
        axios.delete(`/api/employees/${id}`,
            { headers: {
                "Content-Type": "application/json"
            }
        }).then((_) => {
            this.items.splice(idx, 1)
        })
        this.items.splice(idx, 1)
      }
    },
  }
}
</script>
