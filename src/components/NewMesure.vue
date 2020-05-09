<template>
  <section class="hero is-light is-large">
    <div class="hero-body">
      <div class="container">
        <form>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">Nom de la mesure <span class="has-text-danger">*</span></label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input class="input" type="text" v-model="measurename" required :class="{ 'is-danger' : measurenameIsError }">
                  <span class="has-text-danger" v-if="measurenameIsError">Merci de spécifier le nom de la mesure</span>
                </p>
              </div>
            </div>
          </div>
          <label class="label">Sélectionnez votre fichier CSV <span class="has-text-danger">*</span></label>
          <div class="file is-centered" :class="{ 'is-danger' : fileIsError }">
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
        <button class="button is-fullwidth is-success" @click="submit">Envoyer</button>
      </div>
    </div>
    <div class="modal" :class="{ 'is-active' : pendingImport || successImport}">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <article class="media" v-if="pendingImport">
            <div class="media-left">
              <figure class="image is-64x64">
                <i class="fas fa-spinner fa-spin fa-3x" ></i>
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>Pending import</strong>
                  <br>
                  {{ importStatus }}
                  <ul v-if="validity && validity.errors">
                    <li v-for="error in validity.errors" :key="error">{{ error }}</li>
                  </ul>
                </p>
              </div>
            </div>
          </article>
          <article class="media" v-if="successImport">
            <div class="media-left">
              <figure class="image is-64x64">
                <i class="fas fa-check-circle fa-3x" ></i>
              </figure>
            </div>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>Import réussi !</strong>
                  <br>
                  &#60;&#60;&#60; Message explicatif ici &#62;&#62;&#62;
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
      <button class="modal-close is-large" aria-label="close" @click="closeModal"></button>
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
      measurename: null,
      measurenameIsError: false,
      file: null,
      fileIsError: false,
      pendingImport: false,
      successImport: false,
      importStatus: null,
      validity: null
    }
  },
  methods: {
    filesSelected (e) {
      this.file = e.target.files[0]
    },
    submit () {
      this.measurenameIsError = false;
      this.fileIsError = false;
      this.measurenameIsError = !this.measurename
      this.fileIsError = !this.file
      if(!this.fileIsError) {
        if(getFileExtension(this.file).toUpperCase() !== 'CSV') {
          this.fileIsError = true;
        }
      }
      if(!this.fileIsError && !this.measurenameIsError) {
        this.pendingImport = true
        this.importStatus = "Vérification de la structure du fichier CSV"
        readFile(this.file).then((f) => {
          this.validity = isValidCsv(f)
          if(this.validity.isValid) {
            this.importStatus = "Conversion du CSV en cours";
            const measures = measuresFromCsv(f)
            this.importStatus = "Conversion terminée";
            addMeasurerToHistory({
              name: this.measurename,
              createdAt: new Date(),
              measuresGroups: measures
            })
            this.pendingImport = false;
            this.successImport = true;

          }
          else {
            this.importStatus = "CSV invalide"

          }
        })
      }
    },
    closeModal () {
      this.pendingImport = false;
      this.successImport = false;
      this.importStatus = null;
      this.validity = null;
    }
  }
});
</script>

<style scoped>
.field {
  margin-bottom: 25px;
}
form {
  margin: 0px auto 5px auto;
  padding: 5%;
  border: 1px solid black;
  border-radius: 5px;
}
.container {
  width: 80%;
}
</style>
