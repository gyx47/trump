<template>
  
        <wordcloud
        :data="defaultWords"
        nameKey="name"
        valueKey="value"
        :color="myColors"
        :showTooltip="true"
        :wordClick="wordClickHandler">
        </wordcloud>

  </template>
  
  <script>
  import wordcloud from 'vue-wordcloud'
  
  export default {
    name: 'index',
    components: {
      wordcloud
    },
    methods: {
      wordClickHandler(name, value, vm) {
        console.log('wordClickHandler', name, value, vm);
      }
    },
    data() {
      return {
        myColors: ['#1f77b4', '#629fc9', '#94bedb', '#c9e0ef'],
        defaultWords: [{ name: 'poll', value: 302 },
  { name: 'polls', value: 109 },
  { name: 'lead', value: 54 },
  { name: 'cruz', value: 42 },
  { name: 'iowa', value: 42 },
  { name: 'big', value: 41 },
  { name: 'gop', value: 39 },
  { name: 'carson', value: 38 },
  { name: 'debate', value: 36 },
  { name: 'makeamericagreatagain', value: 33 },
  { name: 'rubio', value: 33 },
  { name: 'national', value: 31 },
  { name: 'leading', value: 27 },
  { name: 'hillary', value: 26 },
  { name: 'bush', value: 26 },
  { name: 'america', value: 21 },
  { name: 'shows', value: 21 },
  { name: 'wow', value: 21 },
  { name: 'win', value: 18 },
  { name: 'reuters', value: 18 },
  { name: 'clinton', value: 16 },
  { name: 'fox', value: 12 },
  { name: 'race', value: 12 },
  { name: 'ahead', value: 9 },
  { name: 'voters', value: 8 },
  { name: 'election', value: 6 },
  { name: 'candidate', value: 6 },
  { name: 'pollster', value: 4 },
  { name: 'nominee', value: 4 },
  { name: 'trump', value: 2 }
        ]
      }
    }
  }
  </script>