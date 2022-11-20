<template>
  <div class="announcements">
    <v-container class="mt-4">
      <v-row>
        <v-col cols="12">
          <h1>Announcements for teachers</h1>
        </v-col>
        <v-col cols="12">
          <v-card class="px-3 pb-1 pt-4">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field hide-details="auto" class="pb-2" v-model="title" :rules="rules" label="Title"
                placeholder="Title announcement input" dense required outlined></v-text-field>
              <v-text-field hide-details="auto" class="pb-1" v-model="description" :rules="rules" label="Description"
                placeholder="Description announcement input" dense required outlined></v-text-field>
            </v-form>
            <v-card-actions>
              <v-btn outlined rounded color="indigo accent-4" class="font-weight-bold pa-3"
                @click="createNewAnnouncement">Submit</v-btn>
            </v-card-actions>
        <v-col>
          <v-dialog v-model="dialogTag" scrollable max-width="300px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                Add tag           
              </v-btn>
              <v-chip
      class="ma-2"
      color="pink"
      label
      text-color="white"
    >
      <v-icon left>
        mdi-label
      </v-icon>
      {{tag}}
    </v-chip>
         
             </template>
                
                <v-card>
                  <v-card-title>Select Subject </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="height: 200px;">
                    <v-radio-group  v-model="tag" column>
                      <v-radio label="Important" value="important"></v-radio>
                      <v-radio label="Urgent" value="urgent"></v-radio>
                      <v-radio label="General" value="general"></v-radio>
                      <v-radio label="Review" value="review"></v-radio>
                    </v-radio-group>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="blue darken-1" text @click="dialogTag = false">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-card>

        </v-col>
      </v-row>

      <v-row class="mt-8">
        <v-col cols="12">
          <h1>Announcements confirmed</h1>
        </v-col>
        <v-col cols="12">
          <div v-for="announcement in announcements" :key="announcement.id">
            <v-card class="mx-auto my-3 mx-2" elevation="1">
              <v-card-title>
                <v-icon class="mr-3">mdi-human-queue</v-icon>
                {{ announcement.title }}
              </v-card-title>
              <v-container class="d-flex justify-space-between pt-1 pb-3 px-4 align-center">
                <p class="mb-0">{{ announcement.description }}</p>
                <v-btn outlined rounded color="red accent-4" @click="deleteAnnouncement(announcement.id)">
                  <v-icon>mdi-trash-can</v-icon>
                </v-btn>
              </v-container>
            </v-card>
          </div>
        </v-col>

      </v-row>
    </v-container>
    <v-snackbar v-model="snackbar" color="success" dark>
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>


import AnnouncementsService from '@/announcements/services/announcements.service';

export default {
  name: "announcements",
  data: () => ({
    snackbar: false,
    valid: true,
    text: '',
    color: '',
    user: {},
    announcements: [],
    id: '',
    title: '',
    description: '',
    directorId: null,
    tag: '',
    dialogTag: false,
    rules: [
      value => !!value || 'Required.',
      value => (value && value.length >= 3) || 'Min 3 characters',
    ],
  }),
  created() {
    this.refreshList()

  },
  methods: {
    getDisplayAnnouncement(announcement) {
      return {
        id: announcement.id,
        title: announcement.title,
        description: announcement.description,
        directorId: announcement.directorId
      };
    },
    refreshList() {
      let user = JSON.parse(localStorage.getItem('user'))
      AnnouncementsService.getAllByID(user.id)
        .then((response) => {
          this.announcements = response.data.map(this.getDisplayAnnouncement);
          console.log(response.data);
        })
    },
    createNewAnnouncement() {

      this.$refs.form.validate()
      let val = this.$refs.form.validate();
      if (val) {
        this.user = JSON.parse(localStorage.getItem('user'))
        const announcement = {
          title: this.title,
          description: this.description,
          directorId: this.user.id
        }
        AnnouncementsService.create(announcement)
          .then((response) => {
            console.log(response.data);
            this.text = 'Create announcement correctly';
            this.snackbar = true;
            this.reset();
            this.refreshList();
          })
      }
    },

    deleteAnnouncement(id) {
      AnnouncementsService.delete(id)
        .then(() => {
          this.text = 'Delete announcement correctly';
          this.snackbar = true;
          this.refreshList();
        })
        .catch(e => {
          console.log(e);
        })
    },
    reset() {
      this.$refs.form.reset()
    }
  },
  mounted(){


  }
}
</script>

<style scoped>

</style>