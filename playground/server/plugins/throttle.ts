export default defineNitroPlugin((nitro) => {
  // return;
  nitro.hooks.hook("request", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
})
