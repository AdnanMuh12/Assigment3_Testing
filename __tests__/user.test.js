const request = require("supertest")
const app = require("../app")
const { Photo } = require("../models")
const { verifyToken } = require('../utils/jwt');

const dataPhotos = {
    title: "admin",
    caption: "photo admin",
    image_url: "https://picsum.photos/admin"
}

describe('POST /photos', () => {
    let authToken;
    let createdPhotoId;

    beforeAll(async () => {
    authToken = await verifyToken(token); 

    const response = await createPhoto(dataPhotos, authToken);
    createdPhotoId = response.data.id;
});

afterAll(async () => {
    // Membersihkan setelah pengujian, termasuk menghapus pengguna dan foto
    await deletePhotoAndUser();
});

it('should create a photo successfully', (done) => {
    request(app)
        .post('/photos') // Sesuaikan dengan rute yang sesuai di aplikasi Anda
        .set('Authorization', `Bearer ${authToken}`)
        .send(dataPhotos)
        .expect(200) // 
        end((err, res) => {
            if (err) done(err);

            // Memeriksa apakah respons memiliki properti yang sesuai
            expect(res.body).toHaveProperty('title');
            expect(typeof res.body.photoId).toEqual('id');

            done();
        });
});

it('should return an error when not providing authentication', (done) => {
        request(app)
        .post('/api/photos')
        .send(dataPhotos)
        .expect(401)
        .end((err, res) => {
            if (err) done(err);

            
            expect(res.body).toHaveProperty('error', 'Authentication required');

            done();
        });
});

it('should get all photos successfully', (done) => {
        request(app)
        .get('/photos')
        .end((err, res) => {
            if (err) done(err);

            // Memeriksa apakah respons berisi data foto (sesuai dengan format respons Anda)
            expect(Array.isArray(res.body)).toBe(true);

            done();
    });
});

it('should return an error when not providing authentication', (done) => {
        request(app)
        .get('/photos')
        .expect(401)
        .end((err, res) => {
        if (err) done(err);

            // Memeriksa apakah respons berisi pesan error yang sesuai
            expect(res.body).toHaveProperty('error', 'Authentication required');

            done();
        });
});

it('should get a photo by ID successfully', (done) => {
        request(app)
        .get(`/photos/:id${createdPhotoId}`)
        .expect(200) 
        .end((err, res) => {
            if (err) done(err);

            // Memeriksa apakah respons berisi data foto (sesuai dengan format respons Anda)
            expect(res.body).toHaveProperty('id', createdPhotoId);

            done();
        });
});

it('should return an error when data is not found', (done) => {
    // Gantilah '999' dengan ID yang tidak ada di sistem
    const nonExistentPhotoId = 999;

        request(app)
        .get(`/photos/:id${nonExistentPhotoId}`)
        .expect(401)
        .end((err, res) => {
            if (err) done(err);

            // Memeriksa apakah respons berisi pesan error yang sesuai
            expect(res.body).toHaveProperty('error', 'Photo not found');

            done();
        });
    });
});






























