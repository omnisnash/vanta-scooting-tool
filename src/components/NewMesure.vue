<template>
  <section class="container is-light is-large">
    <form>
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">Nom de la mesure <span class="has-text-danger">*</span></label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input class="input" type="text" v-model="name" required :class="{ 'is-danger' : nameIsError }">
              <span class="has-text-danger" v-if="nameIsError">Merci de spécifier le nom de la mesure</span>
            </p>
          </div>
        </div>
      </div>
      <label class="label">Sélectionnez votre fichier CSV <span class="has-text-danger">*</span></label>
      <div class="file is-large is-centered" :class="{ 'is-danger' : fileIsError }">
        <label class="file-label">
          <input class="file-input" type="file" name="resume" @change="filesSelected" required>
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label">
              Sélectionner un fichier...
            </span>
          </span>
        </label>
      </div>
      <label class="label" v-if="file">{{file.name}}</label>
      <span class="has-text-danger" v-if="fileIsError">Merci de fournir un fichier CSV</span>
    </form>
    <button class="button is-fullwidth is-success is-large" @click="submit">Envoyer</button>
    <div class="modal" :class="{ 'is-active' : process.pending || process.success}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title" v-if="process.errors.length"><span class="icon"><i class="fas fa-times-circle"></i></span> Erreur lors de l'import</p>
          <p class="modal-card-title" v-else-if="process.success"><span class="icon"><i class="fas fa-check-circle"></i></span> Import réussi !</p>
          <p class="modal-card-title" v-else><span class="icon"><i class="fas fa-spinner fa-spin"></i></span> Import en cours</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </div>
        <section class="modal-card-body">
          {{ process.message }}
          <ul v-if="process.errors.length">
            <li v-for="error in process.errors" :key="error">{{ error }}</li>
          </ul>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-large" @click="closeModal">Fermer</button>
          <button class="button is-success is-large" v-if="process.success">Continuer...</button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script>
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import 'bulma/css/bulma.css';
import Vue from 'vue';
import {getFileExtension, readFile} from '@/helpers/FileInputReader'
import {isValidCsv, measuresFromCsv} from '@/helpers/CsvHelper'
import {addMeasurerToHistory} from '@/helpers/LocalStorageHelper'

fontawesome.library.add(solid)

export default Vue.extend({
  name: 'NewMesure',
  data () {
    return {
      name: null,
      file: null,
      process: {
        pending: false,
        isValid: false,
        success: false,
        errors: [],
        message: null
      }
    }
  },
  computed: {
    fileIsError () {
      return !(this.file && getFileExtension(this.file).toUpperCase() === 'CSV')
    },
    nameIsError () {
      return !this.name
    }
  },
  methods: {
    filesSelected (e) {
      this.file = e.target.files[0]
    },
    submit () {
      if(!this.fileIsError && !this.nameIsError) {
        this.process.pending = true
        this.process.message = "Vérification de la structure du fichier CSV"
        readFile(this.file).then((f) => {
          const validity = isValidCsv(f)
          this.process.isValid = validity.isValid
          this.process.errors = validity.errors
          if(this.process.isValid) {
            this.process.message = "Conversion du CSV en cours";
            const measures = measuresFromCsv(f)
            this.process.message = "Conversion terminée";
            addMeasurerToHistory({
              name: this.name,
              createdAt: new Date(),
              measuresGroups: measures
            })
            this.process.pending = false;
            this.process.success = true;

          }
          else {
            this.process.message = "CSV invalide"
          }
        })
      }
    },
    closeModal () {
      this.process = {
        pending: false,
        valid: false,
        success: false,
        errors: [],
        message: null
      }
    }
  }
});
</script>

<style scoped>
.field {
  margin-bottom: 25px;
}
form {
  margin: 5px auto 5px auto;
  padding: 5%;
  border: 1px solid black;
  border-radius: 5px;
}
.container {
  width: 80%;
}
.modal-card-foot {
  justify-content: flex-end
}
</style>
