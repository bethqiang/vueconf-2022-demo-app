describe('ImageDetails', () => {
  describe('before data has loaded', () => {
    it('renders a loading indicator', () => {});
  });

  describe('when data has been loaded successfully', () => {
    it('renders a heading with the image ID', () => {});
    it('renders the image', () => {});

    describe('if there are breeds', () => {
      it('renders the breeds', () => {});
    });

    describe('if there are no breeds', () => {
      it('renders \'Unknown\'', () => {});
    });
  
    describe('favorite section', () => {
      it('renders a favorite button', () => {});
      it('renders a delete favorite button', () => {});
  
      describe('if the image hasn\'t been favorited', () => {
        it('should show \'Not Favorited\'', () => {});
        it('favorite button should not be red', () => {});
        it('delete favorite button should be disabled', () => {});
  
        describe('clicking the favorite button', () => {
          it('should call the API to favorite the image', () => {});
        });
      });
  
      describe('if the image has been favorited', () => {
        it('should show \'Favorited\'', () => {});
        it('favorite button should be red', () => {});
        it('delete favorite button should be enabled', () => {});
  
        describe('clicking the delete button', () => {
          it('should call the API to delete the favorite', () => {});
        });
      });
    });
  
    describe('vote section', () => {
      it('renders upvote and downvote buttons', () => {});
  
      describe('if the image hasn\'t been voted on', () => {
        it('should show \'Not Voted\'', () => {});
        it('upvote button should not be green', () => {});
        it('downvote button should not be red', () => {});
      });
  
      describe('if the image has been upvoted', () => {
        it('should show \'Upvoted\'', () => {});
        it('upvote button should be green', () => {});
      });
  
      describe('if the image has been downvoted', () => {
        it('should show \'Downvoted\'', () => {});
        it('downvote button should be red', () => {});
      });
  
      describe('clicking the upvote button', () => {
        it('should call the API to upvote the image', () => {});
      });
  
      describe('clicking the downvote button', () => {
        it('should call the API to downvote the image', () => {});
      });
    });
  });

  describe('when there was an error loading data', () => {
    it('renders an error alert', () => {});
  });
});
