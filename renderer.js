document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Örnek kullanıcı doğrulama (gerçek uygulamada bu kısım backend'e bağlanmalıdır)
    if (username === 'admin' && password === 'admin123') {
        Swal.fire({
            title: 'Başarılı!',
            text: 'Giriş başarıyla tamamlandı.',
            icon: 'success',
            confirmButtonText: 'Tamam'
        }).then((result) => {
            if (result.isConfirmed) {
                // Burada başarılı girişten sonra yapılacak işlemler
                console.log('Giriş başarılı');
            }
        });
    } else {
        Swal.fire({
            title: 'Hata!',
            text: 'Kullanıcı adı veya şifre hatalı.',
            icon: 'error',
            confirmButtonText: 'Tamam'
        });
    }
}); 