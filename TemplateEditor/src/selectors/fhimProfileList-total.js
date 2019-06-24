export default (fhimProfileList) => {
  return fhimProfileList
      .map((fhimProfile) => fhimProfile.profileUsage)
      .reduce((sum, value) => sum + value, 0);
};
