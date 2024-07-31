from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('admin', admin.site.urls),
    path('',views.index,name='index'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.CustomLogoutView.as_view(), name ='logout'),
    path('register', views.UserRegistration.as_view(), name='register'),
    path('refresh', views.RefreshAccessToken.as_view(), name='refresh_access_token'),
    path('get-items', views.GetItems.as_view(), name='get_items'),
    path('get-orders', views.getOrders.as_view(), name='get_orders'),
    path('get-account-details', views.getaccountdetails.as_view(), name='get-account-details'),
    path('get-pending-orders', views.getPendingOrders.as_view(), name='get-pending-orders'),
    path('get-all-canteens', views.getallcanteens.as_view(), name='get-all-canteens'),
    path('get-cust-orders', views.getcustOrders.as_view(), name='get-cust-orders'),
    path('disable-items', views.DisableItems.as_view(), name='disable-items'),
    path('delete-items', views.DeleteItems.as_view(), name='delete-items'),
    path('create-order', views.createorder.as_view(), name='create-order'),
    path('get-menu/<int:canteen_id>', views.GetMenu.as_view(), name='get-menu'),
    path('get-feedback', views.GetFeedback.as_view(), name='get-feedback'),
    path('get-all-feedback/<int:canteen_id>', views.GetAllFeedback.as_view(), name='get-all-feedback'),
    path('delete-canteen', views.DeleteCanteen.as_view(), name='delete-canteen'),
    path('confirm-order', views.ConfirmOrder.as_view(), name='confirm-order'),
    path('order-delivered', views.OrderDelivered.as_view(), name='order-delivered'),
    path('see-feedback', views.seefeedback.as_view(), name='see-feedback'),
    #path('send-payment', views.PaymentGateway.as_view(), name='send-payment'),
    path('cust-pending-orders', views.CustPendingOrders.as_view(), name='cust-pending-orders'),
    path('cust-delivered-orders', views.CustDeliveredOrders.as_view(), name='cust-delivered-orders'),
    path('get-statistics',views.GetStatistics.as_view(),name = 'get-statistics'),
    path('get-canteen-Login-details', views.GetCanteenLoginDetails.as_view(), name='get-canteen-Login-details'),
    path(r'^activate/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.activate, name='activate'),



    #password forgot urls
    path('reset_password/',auth_views.PasswordResetView.as_view(),name="reset_password"),
    path('reset_password_sent/',auth_views.PasswordResetDoneView.as_view(),name="password_reset_done"),
    path('reset/<uidb64>/<token>/',auth_views.PasswordResetConfirmView.as_view(),name="password_reset_confirm"),
    path('reset_complete/',auth_views.PasswordResetCompleteView.as_view(),name="password_reset_complete"),

    #change password
    path('change_password/',auth_views.PasswordChangeView.as_view(success_url='/home'),name="changepass"),
    path('change_password_done/',auth_views.PasswordChangeDoneView.as_view(),name="changepassdone"),

]
