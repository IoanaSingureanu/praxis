import moment from 'moment';

// Get visible fhimProfileList

export default (fhimProfileList, { text, sortBy, startDate, endDate }) => {
  return fhimProfileList.filter((fhimProfile) => {
    const createdAtMoment = moment(fhimProfile.createdAt);
    const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true;
    const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;
    const textMatch = (text != '') && (
      (text === '*')||(fhimProfile.patientID.toLowerCase().includes(text.toLowerCase())));
    //console.log('Text Match Input: '+text+ ' Text Match ' + textMatch);
    return startDateMatch && endDateMatch && textMatch;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return a.createdAt < b.createdAt ? 1 : -1;
    } else if (sortBy === 'profileUsage') {
      return a.profileUsage < b.profileUsage ? 1 : -1;
    }
  });
};
