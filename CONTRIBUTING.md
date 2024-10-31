# CONTRIBUTING

_**Bu sayfa henüz tamamlanmamıştır.**_

Bu projeye katkıda bulunmak için, aşağıdaki adımları takip edebilirsiniz:

1. Bu projeyi fork edin.
2. Yeni bir branch oluşturun: `git checkout -b yeni-özellik`
3. Değişikliklerinizi commit edin: `git commit -am 'Yeni özellik eklendi'`
4. Branch'inizi push edin: `git push origin yeni-özellik`
5. Pull request oluşturun.
6. Değerlendirme sonrasında pull request'iniz onaylanabilir.
7. Değişikliklerinizin projeye dahil edilmesiyle ilgili bir e-posta alabilirsiniz.

## Katkıda Bulunabileceğiniz Alanlar

Bu projeye katkıda bulunabileceğiniz alanlar aşağıdaki gibidir:

```markdown
apps
├── www
│   ├── app
│   ├── components
│   ├── content
│   └── ui
├── app
│   ├── app
│   ├── components
│   ├── content
│   ├── default
│   │   ├── example
│   │   └── ui
│   └── new-york
│       ├── example
│       └── ui
├── api
│   ├── app
│   └── ui
└── status
    ├── app
    ├── components
    ├── content
    └── registry
packages
    └── cli
tooling
    └── scripts
    ├── build
    ├── deploy
    ├── test
    └── validate
```

```markdown
| Yol                   | Açıklama                               |
| --------------------- | -------------------------------------- |
| `apps/www/app`        | Web sitesi için Next.js uygulaması.    |
| `apps/www/components` | Web sitesi için React bileşenleri.     |
| `apps/www/content`    | Web sitesi için içerik.                |
| `apps/www/registry`   | Bileşenler için kayıt.                 |
| `packages/cli`        | CLI paketi.                            |
```