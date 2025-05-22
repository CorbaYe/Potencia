from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import CambiarContrasenaView, CambiarContrasenaDoneView


urlpatterns = [
    
    path('', views.index, name='index'),
    path('registro/', views.registro, name='registro'),
    path('home/', views.home, name='home'),
    path('logout', views.exit, name='exit'),
    path('atletas/', views.atletas, name='atletas'),
    path('ejercicios/', views.ejercicios, name='ejercicios'),
    path('ejercicios/editar/<int:pk>/', views.editar_ejercicio, name='editar_ejercicio'),
    path('ejercicios/eliminar/<int:pk>/', views.eliminar_ejercicio, name='eliminar_ejercicio'),
    path('atletas/editar/<int:pk>/', views.editar_atleta, name='editar_atleta'),
    path('atletas/eliminar/<int:pk>/', views.eliminar_atleta, name='eliminar_atleta'),
    path('macrociclos', views.macrociclos, name='macrociclos'),
    path('microciclos', views.microciclos, name='microciclos'),
    #micuenta
    path('cuenta/configuracion/', views.configuracion_cuenta, name='configuracion_cuenta'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)