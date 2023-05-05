export const MODELS = [
  {
    url: 'test',
    controls: [
      {
        key: 'id',
        name: 'id',
        label: 'Id',
        type: 'default',
        placeholder: 'Id',
        show: false,
        required: false,
        value: '',
        flex: 1
      },
      {
        key: 'category',
        name: 'category',
        label: 'Tipo',
        type: 'select',
        placeholder: 'Selecione o tipo de teste',
        options: [
          {
            id: 1,
            name: 'Simulado'
          },
          {
            id: 2,
            name: 'Prova'
          }
        ],
        show: true,
        required: true,
        value: '',
        flex: "flex: 1"
      },
      {
        key: 'name',
        name: 'name',
        label: 'Nome',
        type: 'default',
        placeholder: 'Nome',
        show: true,
        required: true,
        value: '',
        flex: "flex: 1"
      },
      {
        key: 'teacher',
        name: 'teacher',
        label: 'Professor',
        type: 'popup',
        placeholder: 'Selecione um professor',
        show: true,
        required: true,
        value: '',
        flex: "flex: 1",
        breakBefore: true,
        url: 'teacher',
        headers: [
          {
            key: 'id',
            label: 'ID',
          },
          {
            key: 'name',
            label: 'Professor',
          }
        ]
      },
      {
        key: 'discipline',
        name: 'discipline',
        label: 'Matéria',
        type: 'select',
        options: [
          {
            id: 1,
            name: 'Matemática'
          },
          {
            id: 2,
            name: 'Português'
          }
        ],
        placeholder: 'Selecione uma matéria',
        show: true,
        required: true,
        value: '',
        flex: "flex: 1",
      },
      {
        key: 'bimester',
        name: 'bimester',
        label: 'Bimestre',
        type: 'select',
        options: [
          {
            id: 1,
            name: '1BIM'
          },
          {
            id: 2,
            name: '2BIM'
          }
        ],
        placeholder: 'Selecione um bimestre',
        show: true,
        required: true,
        value: '',
        flex: "flex: 1",
        breakBefore: true
      },
      {
        key: 'year',
        name: 'year',
        label: 'Ano',
        type: 'select',
        options: [
          {
            id: 1,
            name: '2023'
          }
        ],
        placeholder: 'Selecione um ano letivo',
        show: true,
        required: true,
        value: '',
        readonly: true,
        flex: "flex: 1"
      }
    ]
  },
  {
    url: 'discipline',
    controls: [
      {
        key: 'id',
        name: 'id',
        label: 'ID',
        type: 'input',
        placeholder: 'ID',
        disabled: true,
        required: false,
        hidden: true,
        value: ''
      }
    ]
  },
  {
    url: 'classroom',
    controls: [
      {
        key: 'id',
        name: 'id',
        label: 'ID',
        type: 'input',
        placeholder: 'ID',
        disabled: true,
        required: false,
        hidden: true,
        value: ''
      }
    ]
  }
]
