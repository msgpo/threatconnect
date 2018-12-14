'use strict';

polarity.export = PolarityComponent.extend({
  newTagValue: '',
  timezone: Ember.computed('Intl', function() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }),
  _flashError: function(msg) {
    this.get('flashMessages').add({
      message: "ThreatConnect: " + msg,
      type: 'unv-danger',
      timeout: 3000
    });
  },
  actions: {
    saveConfidence(orgData, orgDataIndex) {
      console.info('Saving Confidence');
      let self = this;

      self.set('block.isLoadingDetails', true);
      const payload = {
        action: 'SET_CONFIDENCE',
        data: {
          indicatorValue: orgData.meta.indicatorValue,
          indicatorType: orgData.meta.indicatorType,
          owner: orgData.owner.name,
          confidence: orgData.confidence
        }
      };

      this.sendIntegrationMessage(payload)
        .then(
          function(result) {
            self.set('actionMessage', 'Set confidence to : ' + orgData.confidence);
            self.set('block.data.details.' + orgDataIndex + '.confidenceHuman', result.confidenceHuman);
          },
          function(err) {
            console.error(err);
            self._flashError(err.meta.detail, 'error');
          }
        )
        .finally(() => {
          self.set('block.isLoadingDetails', false);
        });
    },
    addTag(orgData, orgDataIndex) {
      let self = this;

      const newTag = this.get('newTagValue').trim();
      if (newTag.length === 0) {
        this.set('actionMessage', 'You must enter a tag');
        return;
      }

      self.set('block.isLoadingDetails', true);
      const payload = {
        action: 'ADD_TAG',
        data: {
          indicatorValue: orgData.meta.indicatorValue,
          indicatorType: orgData.meta.indicatorType,
          owner: orgData.owner.name,
          tag: newTag
        }
      };

      this.sendIntegrationMessage(payload)
        .then(
          function() {
            self.set('actionMessage', 'Added Tag');
            self.get('block.data.details.' + orgDataIndex + '.tag').pushObject({
              name: newTag,
              webLink: ''
            });
          },
          function(err) {
            console.error(err);
            self._flashError(err.meta.detail, 'error');
          }
        )
        .finally(() => {
          self.set('newTagValue', '');
          self.set('block.isLoadingDetails', false);
        });
    },
    deleteTag(tag, orgData, orgDataIndex, tagIndex) {
      let self = this;

      self.set('block.isLoadingDetails', true);
      const payload = {
        action: 'DELETE_TAG',
        data: {
          indicatorValue: orgData.meta.indicatorValue,
          indicatorType: orgData.meta.indicatorType,
          owner: orgData.owner.name,
          tag: tag
        }
      };

      this.sendIntegrationMessage(payload)
        .then(
          function(result) {
            self.set('actionMessage', 'Deleted Tag');
            const newTags = [];
            let tags = self.get('block.data.details.' + orgDataIndex + '.tag');
            tags.forEach(function(tag, index) {
              if (index !== tagIndex) {
                newTags.push(tag);
              }
            });

            self.set('block.data.details.' + orgDataIndex + '.tag', newTags);
          },
          function(err) {
            console.error(err);
            self._flashError(err.meta.detail, 'error');
          }
        )
        .finally(() => {
          self.set('block.isLoadingDetails', false);
        });
    },
    reportFalsePositive(orgData, orgDataIndex) {
      let self = this;

      self.set('block.isLoadingDetails', true);
      const payload = {
        action: 'REPORT_FALSE_POSITIVE',
        data: {
          indicatorValue: orgData.meta.indicatorValue,
          indicatorType: orgData.meta.indicatorType,
          owner: orgData.owner.name
        }
      };

      this.sendIntegrationMessage(payload)
        .then(
          function(result) {
            self.set('actionMessage', 'Marked as False Positive');
            self.set('block.data.details.' + orgDataIndex + '.falsePositiveLastReported', result.lastReported);
            self.set('block.data.details.' + orgDataIndex + '.falsePositiveCount', result.count);
          },
          function(err) {
            console.error(err);
            self._flashError(err.meta.detail, 'error');
          }
        )
        .finally(() => {
          self.set('block.isLoadingDetails', false);
        });
    },
    setRating(orgData, orgDataIndex, rating) {
      let self = this;

      self.set('block.isLoadingDetails', true);
      const payload = {
        action: 'SET_RATING',
        data: {
          indicatorValue: orgData.meta.indicatorValue,
          indicatorType: orgData.meta.indicatorType,
          owner: orgData.owner.name,
          rating: rating
        }
      };

      this.sendIntegrationMessage(payload)
        .then(
          function(result) {
            self.set('actionMessage', 'Set rating to : ' + rating);
            self.set('block.data.details.' + orgDataIndex + '.rating', rating);
            self.set('block.data.details.' + orgDataIndex + '.ratingHuman', result.ratingHuman);
          },
          function(err) {
            console.error(err);
            self._flashError(err.meta.detail, 'error');
          }
        )
        .finally(() => {
          self.set('block.isLoadingDetails', false);
        });
    }
  }
});
