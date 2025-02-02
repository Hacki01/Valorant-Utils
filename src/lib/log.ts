const log = (message: string, component: string, method: string) => {
  console.info(
    `[🐺][🧰 ${component}][🔧 ${method}][📃 ${message} ]`,
  );
};

export { log };
