from django.contrib import admin
from .models import Holiday, Entrenadores, Atletas, Ejercicios

admin.site.register(Holiday)
admin.site.register(Entrenadores)
admin.site.register(Atletas)
admin.site.register(Ejercicios)