import { useState } from 'react'
import { blogPosts } from '../../data/blog.js'
import { Button } from '../../components/atoms/Button/Button.jsx'

export function BlogView() {
  const [selectedPost, setSelectedPost] = useState(null)

  if (selectedPost) {
    return (
      <div className="section min-vh-70">
        <div className="container" style={{ maxWidth: '800px' }}>
          <Button
            variant="light"
            size="small"
            className="mb-4"
            onClick={() => setSelectedPost(null)}
          >
            &larr; Volver a las historias
          </Button>

          <h1 className="title is-2 mb-3">{selectedPost.titulo}</h1>
          <p className="subtitle is-6 has-text-grey mb-4">{selectedPost.resumen}</p>

          <div className="mb-5">
            <img
              src={selectedPost.img}
              alt={selectedPost.titulo}
              className="img-blog-header"
              onError={(e) => {
                e.target.src = 'https://placehold.co/800x400?text=Fútbol+Blog'
              }}
            />
          </div>

          <div
            className="content is-medium has-text-grey-dark"
            style={{ lineHeight: '1.9' }}
          >
            {selectedPost.contenido.split('\n\n').map((parrafo, i) => (
              <p key={i}>{parrafo}</p>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container">
        <div className="has-text-centered mb-6">
          <h1 className="title is-2">Historias y Curiosidades del Fútbol</h1>
          <p className="subtitle is-6 has-text-grey">
            Anécdotas legendarias, mitos e historias detrás de las camisetas más recordadas
          </p>
        </div>

        <div className="columns is-multiline">
          {blogPosts.map((post) => (
            <div key={post.id} className="column is-12-mobile is-6-tablet is-4-desktop">
              <div className="card h-100" onClick={() => setSelectedPost(post)}>
                <div className="card-image">
                  <figure className="image">
                    <img
                      src={post.img}
                      alt={post.titulo}
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x250?text=Blog'
                      }}
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <div>
                    <h3 className="title is-6 mb-2">{post.titulo}</h3>
                    <p className="is-size-7 has-text-grey mb-4">{post.resumen}</p>
                  </div>
                  <Button variant="primary" size="small" className="is-fullwidth">
                    Leer Historia Completa
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
