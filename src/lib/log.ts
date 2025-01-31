const log = (message: string, component: string, method: string) => {
  console.info(
    `%c[🐺][🧰 ${component}][🔧 ${method}][📃 ${message} ]`,
  );
};

export { log };
