export default {
  props: ["pages"],
  template: `
              <ul class="pagination justify-content-center">
              <li class="page-item" :class="{disabled:!pages.has_pre}">
                <a class="page-link" href="#" @click.prevent="$emit('get-product', pages.current_page-1)" aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item" :class="{active:page===pages.current_page}" v-for="page in pages.total_pages">
                <a class="page-link" @click.prevent="$emit('get-product', page)" href="#">{{page}}</a></li>
              <li class="page-item" :class="{disabled:!pages.has_next}">
                <a class="page-link" href="#" @click.prevent="$emit('get-product', pages.current_page+1)" aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
  `,
};
