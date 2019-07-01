const templates = {};

$("[type='text/x-handlebars']").each(function () {
  const $template = $(this);

  templates[$template.attr('id')] = Handlebars.compile($template.html());
});

function formatDatetime(datetime) {
  const year = datetime.getFullYear();
  const month = datetime.getMonth() + 1;
  const date = datetime.getDate();
  const hours = datetime.getHours();
  const minutes = datetime.getMinutes();
  const seconds = datetime.getSeconds();

  return `${year}-${month}-${date}T${hours}:${minutes}:${seconds}`;
}

function formatDate(datetime) {
  const months = [
    'Jan', 'Feb', 'Mar',
    'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec',
  ];

  const suffixOverrides = ['st', 'nd', 'rd'];
  let dateSuffix = 'th';

  const year = datetime.getFullYear();
  const month = datetime.getMonth();
  const date = datetime.getDate();
  const hours = datetime.getHours();
  const minutes = datetime.getMinutes();
  const seconds = datetime.getSeconds();
  
  if (date <= 3) {
    dateSuffix = suffixOverrides[date-1];
  }

  return `${months[month]} ${date}${dateSuffix}, ${year} ` +
    `${hours}:${minutes}:${seconds}`;  
}

const ProductModel = Backbone.Model.extend({
  setDatetime: function () {
    const datetime = new Date(this.get('date'));

    this.set('datetime', formatDatetime(datetime));
  },

  setDateFormatted: function () {
    const datetime = new Date(this.get('date'));

    this.set('dateFormatted', formatDate(datetime));
  },

  initialize: function () {
    this.setDatetime();
    this.setDateFormatted();
  }
});

const product = new ProductModel(productJSON);

function renderProduct() {
  $('article').html(templates.product(product.toJSON()));
}

function renderForm() {
  $('fieldset').html(templates.form(product.toJSON()));
}

renderProduct();
renderForm();

$('form').on('submit', function (e) {
  e.preventDefault();
  const inputs = $(this).serializeArray();
  const datetime = new Date();
  const attrs = {};

  inputs.forEach(function (input) {
    attrs[input.name] = input.value;
  });

  attrs.datetime = formatDatetime(datetime);
  attrs.dateFormatted = formatDate(datetime);
  attrs.date = datetime.valueOf();

  product.set(attrs);

  renderProduct();
});
