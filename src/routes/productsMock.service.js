// import faker from 'faker'
import faker from 'faker'

const generateProduct = () => {
    const title = faker.commerce.productName();
    const description = faker.lorem.paragraph();
    const code = faker.datatype.uuid();
    const price = faker.commerce.price();
    const status = faker.datatype.boolean();
    const stock = faker.datatype.number({ min: 1, max: 1000 });
    const category = faker.commerce.department();
    const thumbnail = faker.image.imageUrl();

    return {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail
    };
};

export default generateProduct