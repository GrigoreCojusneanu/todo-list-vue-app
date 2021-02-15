import { shallowMount } from '@vue/test-utils'
import TodoList from '@/components/TodoList.vue'

describe('TodoList.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(TodoList, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
