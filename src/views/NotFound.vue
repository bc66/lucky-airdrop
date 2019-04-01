<template>
  <div class="app">
    <header class="navbar navbar-default" id="header">
      <div class="container-fluid header">
        <div class="row">
          <div class="col-sm-3 col-xs-12 navbar-header header--logo">
            <h3><router-link :to="{ name: 'home'}">Lucky Airdrop</router-link></h3>
          </div>
        </div>
      </div>
    </header>

    <div class="container-fluid content error-page error-page--error404">
      <div class="error-container">
        <h2>Page Not Found (404)</h2>
        <span>
          <p>The page you requested could not be found.</p>
          <p>If you were trying to claim an envelope, please check you entered the correct URL.</p>
        </span>
        <p class="error-page--buttons">
          <a class="btn btn-create" href="/create">Create an Red Envelope</a>
        </p>
      </div>
    </div>
  </div>
</template>