<template>
  <v-navigation-drawer
    v-model="visible"
    class="nav1_bg"
    app
    dark
    :width="200"
    permanent
  >
    <!--<v-toolbar>{{$t('NavDrawer.Title')}}</v-toolbar>-->
    <v-list
      v-if="items"
    >
      <div
        v-if="items && current>=0"
      >
        <v-list-item
          :key="items[current].path"
          :to="items[current].path"
          active-class="active-section-active"
          class="active-section"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ $t(`NavDrawer.${items[current].title}`) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="item in items[current].child"
          :key="item.path"
          :to="item.path"
          active-class="active-section-active"
          class="active-section"
          dense
        >
          <v-list-item-content>
            <v-list-item-title
              class="pl-5"
            >
              {{ $t(`NavDrawer.${item.title}`) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
      <div
        v-for="(item, i) in items"
        :key="i"
      >
        <v-list-item
          v-if="i!==current && !item.child"
          v-ripple
          clickable
          :to="item.path"
        >
          <!-- не активный раздел без детей -->
          <v-list-item-icon>
            <v-icon v-text="item.icon"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ $t(`NavDrawer.${item.section}`) }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- не активный раздел c детьми -->
        <v-menu
          v-if="i!==current && item.child"
          dark
          left
          fixed
          min-width="250px"
          max-width="250px"
          nudge-width="250px"
        >
          <template v-slot:activator="{ on }">
            <v-list-item

              :active="false"
              class="px-1"
              v-on="on"
            >
              <v-list-item-icon
                class="mx-2"
              >
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ $t(`NavDrawer.${item.title}`) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <v-list
            class="nav2_bg"
          >
            <v-list-item
              :key="item.path"
              :to="item.path"
            >
              <v-list-item-icon
                class="mx-2"
              >
                <v-icon v-text="item.icon"/>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                 {{ $t(`NavDrawer.${item.title}`) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="subitem in item.child"
              :key="subitem.path"
              :to="subitem.path"
              dense
            >
              <v-list-item-content>
                <v-list-item-title
                  class="pl-5"
                >
                  {{ $t(`NavDrawer.${subitem.title}`) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>
<!--<i18n src="./locales/en.json"></i18n>-->
<script>
export default {
  computed: {
    activePath: {
      get: function() {
        return this.$route.path
      }
    },
    items: {
      get: function() {
        return this.$store.state.NavDrawer.items
      }
    },
    current: {
      get: function() {
        let index = this.$store.state.NavDrawer.index[this.$route.path]
        if (index >= 0) {
          return index
        }
        return -1
      }
    },
    visible: {
      get: function() {
        return this.$store.state.NavDrawer.visible
      },
      set: function(val) {
        this.$store.commit('NavDrawerVisible', val)
      }
    }
  },
  mounted() {
    this.$store.dispatch('Load', { path: this.$route.path, locale: this.$i18n.locale, router: this.$router })
  }
}
</script>

<style lang="scss">
  .v-list-item--active {
    /*background-color: green;*/
  }

  .active-section {
    /*background-color: #273748;*/
    &v-list-item--active {
      /*background-color: green;*/
    }
    &:active {
      /*background-color: green;*/
    }
    &:hover {
      /*background-color: #465E73;*/
    }
    &:focus {
      /*background-color: darkorange;*/
    }
    &-active {
      /*background-color: #273748;*/
      /*border-left: 3px solid var(--v-error);*/
      /*color: var(--v-nav1-base);*/
    }

  }

  .passive-section {
    /*background-color: red;*/
    &:active {
      /*background-color: green;*/
    }
    &:hover {
      /*background-color: yellow;*/
    }
    &:focus {
      /*background-color: blue;*/
    }
    &:focus, :active {
      /*border-left: 3px solid var(--v-primary-base);*/
      /*background-color: var(--v-nav1_bg-lighten1);*/
      /*color: var(--v-nav1-base);*/
    }
  }

  .passive-submenu {
    /*background-color: var(--v-nav1_bg-lighten1);*/
    /*&:hover, :focus {*/
    /*background-color: var(--v-nav1_bg-lighten2)*/
    /*}*/
    /*&:active {*/
    /*background-color: var(--v-nav1_bg-lighten1);*/
    /*}*/
  }


</style>
