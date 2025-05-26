for (var i = 1; i <= 10; i++) {
  setTimeout(() => {
    console.log(i);
  }, 0);
  setTimeout(() => {
    console.log("i", i);
  }, 10000);
}
