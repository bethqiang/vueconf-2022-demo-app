import '@testing-library/jest-dom';
import { render } from '@/utils';
import { createTestingPinia } from '@pinia/testing';
// import userEvent from '@testing-library/user-event';
import ImageDetails from '../ImageDetails.vue';
import { imagesApi } from '@/api';

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: 'HJ7Pzg5EQ' }
  }),
}));

const store = createTestingPinia({
  initialState: {
    favorites: [],
    votes: []
  }
});

const mockReturn = {
  data: {
    id: 'HJ7Pzg5EQ',
    url: 'https://cdn2.thedogapi.com/images/HJ7Pzg5EQ_1280.jpg',
    breeds: [{ name: 'Golden Retriever' }]
  }
};

const renderComponent = (options = {}) => render(ImageDetails, { global: { plugins: [store] }, ...options });

describe('ImageDetails', () => {

  beforeEach(() => {
    vi.spyOn(imagesApi, 'findById').mockResolvedValue(mockReturn);
  });

  it('renders a heading with the image ID', async () => {
    const { findByRole } = renderComponent();
    const heading = await findByRole('heading', { name: `Image ${mockReturn.data.id}` });
    expect(heading).toBeInTheDocument();
  });

});
