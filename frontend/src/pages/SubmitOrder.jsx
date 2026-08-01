import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, useFieldArray } from 'react-hook-form'
import { 
  HiPlus, 
  HiTrash, 
  HiPhoto,
  HiCheckCircle,
  HiArrowPath
} from 'react-icons/hi2'
import SEO from '../components/SEO'
import LoadingSpinner from '../components/LoadingSpinner'

export default function SubmitOrder() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImages, setPreviewImages] = useState([])

  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      productLinks: [{ url: '' }],
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'productLinks'
  })

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    const previews = files.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...previews])
  }

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Order submitted:', data)
    setIsSubmitting(false)
    setIsSubmitted(true)
    reset()
    setPreviewImages([])
  }

  const resetForm = () => {
    setIsSubmitted(false)
    reset()
    setPreviewImages([])
  }

  return (
    <>
      <SEO 
        title="Submit Order | SHEIN with Rejo"
        description="Submit your SHEIN order request. Send us product links or screenshots and we will handle the rest."
        path="/submit-order"
      />

      <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 min-h-screen">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <span className="text-accent text-sm font-semibold uppercase tracking-wider">Order Request</span>
              <h1 className="font-display text-4xl sm:text-5xl font-bold text-charcoal dark:text-white mt-3 mb-4">
                Submit Your Order
              </h1>
              <p className="text-charcoal/70 dark:text-white/70 max-w-xl mx-auto">
                Fill out the form below with your details and product information. 
                We will review your request and contact you with pricing.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="card p-8 sm:p-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-charcoal dark:text-white mb-4">
                    Thank You!
                  </h2>
                  <p className="text-charcoal/70 dark:text-white/70 mb-8 max-w-md mx-auto">
                    We will review your order and contact you with pricing and payment details 
                    as soon as possible.
                  </p>
                  <button
                    onClick={resetForm}
                    className="btn-secondary inline-flex items-center"
                  >
                    <HiArrowPath className="w-5 h-5 mr-2" />
                    Submit Another Order
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="card p-6 sm:p-8 lg:p-10 space-y-6"
                >
                  {/* Customer Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">
                      Customer Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                          Full Name *
                        </label>
                        <input
                          {...register('fullName', { required: 'Full name is required' })}
                          className="input-field dark:input-field-dark"
                          placeholder="John Doe"
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          {...register('phone', { required: 'Phone number is required' })}
                          className="input-field dark:input-field-dark"
                          placeholder="0784 487 866"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                          Email
                        </label>
                        <input
                          {...register('email', { 
                            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                          })}
                          type="email"
                          className="input-field dark:input-field-dark"
                          placeholder="you@example.com"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                          Delivery Address *
                        </label>
                        <input
                          {...register('address', { required: 'Delivery address is required' })}
                          className="input-field dark:input-field-dark"
                          placeholder="123 Main St, Harare"
                        />
                        {errors.address && (
                          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-sand dark:border-white/10 pt-6">
                    <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">
                      Product Details
                    </h3>

                    {/* Product Links */}
                    <div className="space-y-3 mb-6">
                      <label className="block text-sm font-medium text-charcoal dark:text-white">
                        Product Links
                      </label>
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                          <input
                            {...register(`productLinks.${index}.url`)}
                            className="input-field dark:input-field-dark flex-1"
                            placeholder="https://shein.com/..."
                          />
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center 
                                         text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors shrink-0"
                            >
                              <HiTrash className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => append({ url: '' })}
                        className="inline-flex items-center text-sm text-accent hover:text-accentHover transition-colors"
                      >
                        <HiPlus className="w-4 h-4 mr-1" />
                        Add Another Link
                      </button>
                    </div>

                    {/* Screenshot Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                        Screenshot Upload
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                          id="screenshots"
                        />
                        <label
                          htmlFor="screenshots"
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed 
                                     border-sand dark:border-white/20 rounded-xl cursor-pointer hover:border-accent 
                                     dark:hover:border-accent transition-colors bg-beige/30 dark:bg-white/5"
                        >
                          <HiPhoto className="w-8 h-8 text-warm dark:text-white/40 mb-2" />
                          <span className="text-sm text-charcoal/60 dark:text-white/60">
                            Click to upload screenshots
                          </span>
                          <span className="text-xs text-charcoal/40 dark:text-white/40 mt-1">
                            PNG, JPG up to 5MB each
                          </span>
                        </label>
                      </div>

                      {/* Image Previews */}
                      {previewImages.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
                          {previewImages.map((src, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                              <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center
                                           text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <HiTrash className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Size, Color, Quantity */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                          Size
                        </label>
                        <input
                          {...register('size')}
                          className="input-field dark:input-field-dark"
                          placeholder="S, M, L, XL..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                          Color
                        </label>
                        <input
                          {...register('color')}
                          className="input-field dark:input-field-dark"
                          placeholder="Black, White..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                          Quantity
                        </label>
                        <input
                          {...register('quantity', { valueAsNumber: true })}
                          type="number"
                          min="1"
                          defaultValue="1"
                          className="input-field dark:input-field-dark"
                        />
                      </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-charcoal dark:text-white mb-1.5">
                        Special Instructions
                      </label>
                      <textarea
                        {...register('instructions')}
                        rows={3}
                        className="input-field dark:input-field-dark resize-none"
                        placeholder="Any specific requirements or notes..."
                      />
                    </div>
                  </div>

                  {/* Preferred Contact */}
                  <div className="border-t border-sand dark:border-white/10 pt-6">
                    <label className="block text-sm font-medium text-charcoal dark:text-white mb-3">
                      Preferred Contact Method *
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['WhatsApp', 'Phone', 'Email'].map((method) => (
                        <label
                          key={method}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-sand dark:border-white/10 
                                     cursor-pointer hover:border-accent dark:hover:border-accent transition-colors
                                     has-[:checked]:bg-accent/10 has-[:checked]:border-accent"
                        >
                          <input
                            {...register('contactMethod', { required: true })}
                            type="radio"
                            value={method}
                            className="w-4 h-4 text-accent border-sand focus:ring-accent"
                          />
                          <span className="text-sm text-charcoal dark:text-white">{method}</span>
                        </label>
                      ))}
                    </div>
                    {errors.contactMethod && (
                      <p className="text-red-500 text-xs mt-2">Please select a contact method</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-gradient w-full disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoadingSpinner size="sm" />
                          Submitting...
                        </span>
                      ) : (
                        'Submit Order Request'
                      )}
                    </button>
                    <p className="text-xs text-charcoal/40 dark:text-white/40 text-center mt-3">
                      No payment required at this stage. We will contact you with pricing details.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </>
  )
}
