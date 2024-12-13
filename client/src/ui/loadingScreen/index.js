let LoadingScreen = {};

LoadingScreen.setLoading = function(isLoading) {
    const loadingScreen = document.getElementById('loading-screen');
      if (isLoading) {
        loadingScreen.classList.remove('hidden');
        loadingScreen.classList.add('flex');
      } else {
        loadingScreen.classList.remove('flex');
        loadingScreen.classList.add('hidden');
      }
}

export { LoadingScreen };