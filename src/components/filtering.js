export function initFiltering(elements) {
  const updateIndexes = (indexes) => {
    if (!indexes || typeof indexes !== "object") {
      console.error("Indexes is not a valid object:", indexes);
      return;
    }

    Object.keys(indexes).forEach((elementName) => {
      if (
        elements[elementName] &&
        indexes[elementName] &&
        typeof indexes[elementName] === "object"
      ) {
        elements[elementName].innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Все";
        elements[elementName].append(defaultOption);

        elements[elementName].append(
          ...Object.values(indexes[elementName]).map((name) => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            return option;
          })
        );
      } else {
        console.warn(`Element ${elementName} not found or invalid indexes`);
      }
    });
  };

  const applyFiltering = (query, state, action) => {
    // код с обработкой очистки поля
    if (action && action.name === "clear") {
      const parent = action.parentElement;
      const input = parent.querySelector("select, input");
      const field = action.dataset.field;

      if (input) input.value = "";
      if (field && field in state) {
        delete state[field];
      }
    }

    // @todo: #4.5 — отфильтровать данные, используя компаратор
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          // ищем поля ввода в фильтре с непустыми данными
          filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
        }
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query; // если в фильтре что-то добавилось, применим к запросу
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
