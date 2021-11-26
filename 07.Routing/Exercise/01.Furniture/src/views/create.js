import { createFurniture } from '../api/data.js';
import { html } from '../lib.js';

const template = (onCreate, errorMsg, errors) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Create New Furniture</h1>
        <p>Please fill all fields.</p>
    </div>
</div>
<form @submit=${onCreate}>
    ${errorMsg ? html`<div class="form-group error">${errorMsg}</div>` : null}
    <div class="row space-top">
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-make">Make</label>
                <input class="form-control ${errors.make ? 'is-invalid' : 'is-valid'}" id="new-make" type="text"
                    name="make">
            </div>
            <div class="form-group has-success">
                <label class="form-control-label" for="new-model">Model</label>
                <input class="form-control ${errors.model ? 'is-invalid' : 'is-valid'}" id="new-model" type="text"
                    name="model">
            </div>
            <div class="form-group has-danger">
                <label class="form-control-label" for="new-year">Year</label>
                <input class="form-control ${errors.year ? 'is-invalid' : 'is-valid'}" id="new-year" type="number"
                    name="year">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-description">Description</label>
                <input class="form-control ${errors.description ? 'is-invalid' : 'is-valid'}" id="new-description"
                    type="text" name="description">
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-price">Price</label>
                <input class="form-control ${errors.price ? 'is-invalid' : 'is-valid'}" id="new-price" type="number"
                    name="price">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-image">Image</label>
                <input class="form-control ${errors.img ? 'is-invalid' : 'is-valid'}" id="new-image" type="text"
                    name="img">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-material">Material (optional)</label>
                <input class="form-control is-valid" id="new-material" type="text" name="material">
            </div>
            <input type="submit" class="btn btn-primary" value="Create" />
        </div>
    </div>
</form>`;

export function createPage(ctx) {
    update(null, {});

    function update(errorMsg, errors) {
        ctx.render(template(onCreate, errorMsg, errors));
    }

    async function onCreate(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        const make = formData.get('make').trim();
        const model = formData.get('model').trim();
        const year = formData.get('year').trim();
        const description = formData.get('description').trim();
        const price = formData.get('price').trim();
        const img = formData.get('img').trim();

        const furniture = {
            make,
            model,
            year,
            description,
            price,
            img
        };

        try {
            if (make == '' || model == '' || year == '' || description == '' || price == '' || img == '') {
                throw {
                    error: new Error('All fields are required!'),
                    errors: {
                        make: make == '',
                        model: model == '',
                        year: year == '',
                        description: description == '',
                        price: price == '',
                        img: img == ''
                    }
                };
            }

            if (make.length < 4) {
                throw {
                    error: new Error('Make must be at least 4 symbols long!'),
                    errors: {
                        make: true
                    }
                };
            }

            if (model.length < 4) {
                throw {
                    error: new Error('Model must be at least 4 symbols long!'),
                    errors: {
                        model: true
                    }
                };
            }

            if (Number(year) < 1950 || Number(year) > 2050) {
                throw {
                    error: new Error('Year must be between 1950 and 2050!'),
                    errors: {
                        year: true
                    }
                };
            }

            if (description.length < 10) {
                throw {
                    error: new Error('Description must be more than 10 symbols!'),
                    errors: {
                        description: true
                    }
                };
            }

            if (Number(price) < 0) {
                throw {
                    error: new Error('Price must be a positive number!'),
                    errors: {
                        price: true
                    }
                };
            }

            await createFurniture(furniture);

            event.target.reset();
            ctx.updateUserNav();
            ctx.page.redirect('/');
        }
        catch (error) {
            const errorMsg = error.message || error.error.message;
            update(errorMsg, error.errors);
        }
    }
}